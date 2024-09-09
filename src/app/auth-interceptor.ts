import { HttpRequest, HttpEvent, HttpHandlerFn, HttpEventType } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    return next(req).pipe(tap(e => {
     if(e.type === HttpEventType.Response) {
        console.log(req.headers);
        console.log(e.status);
     } else {
        console.log('else');
     }
    }));
  }