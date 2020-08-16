import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let admin_token: any = JSON.parse(this.cookieService.get('token') ? this.cookieService.get('token') : null);
    if (admin_token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${admin_token}`
        }
      });
    }
    return next.handle(request);
  }
}