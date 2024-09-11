import { HttpRequest, HttpEvent, HttpHandlerFn, HttpEventType, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Service } from './service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
   const service = inject(Service); 
   const token = service.token || localStorage.getItem('token') || ''

   const authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'  
      }
    });

   return next(authReq).pipe(tap(req => {
      if (req.type === HttpEventType.Response) {
         let refresh = req.headers.get("refresh_token")
         if(refresh != null) {
            service.token = refresh;
            localStorage.setItem('token',refresh);
         }
       }
     }),
     catchError(error => {
      console.log(error);
      if (error.status === 401 || error.status === 403) {
         console.log('trying again');
        const retryReq = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${service.token || localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json'
          }
        });

        return next(retryReq).pipe(
          tap(event => {
            console.log(event);
            if (event.type === HttpEventType.Response) {
              const refreshToken = event.headers.get('refresh_token');
              if (refreshToken) {
                service.token = refreshToken;
                localStorage.setItem('token', refreshToken);
              }
            }
          }),
          catchError(error => {
            console.log(error);
            return throwError(() => error);
          })
        );
      } else {
         console.log(error)
        return throwError(() => error);
      }
    })
  );
}