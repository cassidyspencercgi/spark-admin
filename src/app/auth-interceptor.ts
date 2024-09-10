import { HttpRequest, HttpEvent, HttpHandlerFn, HttpEventType, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
     })
   );
};