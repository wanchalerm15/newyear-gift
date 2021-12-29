import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req.clone({
        url: /http:|https:/.test(req.url) ? req.url : `${environment.apiURL}/${req.url}`
      }))
      .pipe(catchError(err => {
        if (err.error && err.error.message) err.message = err.error.message;
        return throwError(() => err);
      }))
  }

}
