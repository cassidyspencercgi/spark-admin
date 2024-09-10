import { HttpRequest, HttpEvent, HttpHandlerFn, HttpEventType, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Service } from './service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
   const service = inject(Service); 
   return next(req).pipe(tap(req => {
      if (req.type === HttpEventType.Response) {
      
         let refresh = req.headers.get("refresh_token")
         if(refresh != null) {
            service.token = refresh;
         }

       }
     })
   );
};