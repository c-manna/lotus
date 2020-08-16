import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  urlsToNotUse: Array<string>;
  constructor(private cookieService: CookieService) {
    this.urlsToNotUse = [
      'http://api.ipify.org/?format=json',
      'myController1/myAction1/.+',
      'myController1/myAction2/.+',
      'myController1/myAction3'
    ];
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let admin_token: any = JSON.parse(this.cookieService.get('token') ? this.cookieService.get('token') : null);
    if (admin_token && request.url != 'http://api.ipify.org/?format=json') {
      console.log(request.url)
      //if (this.isValidRequestForInterceptor(request.url)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${admin_token}`
        }
      });
      /*
        return next.handle(request);
      } 
       */
    }
    return next.handle(request);
  }

  private isValidRequestForInterceptor(requestUrl: string): boolean {
    let positionIndicator: string = 'api/';
    let position = requestUrl.indexOf(positionIndicator);
    if (position > 0) {
      let destination: string = requestUrl.substr(position + positionIndicator.length);
      for (let address of this.urlsToNotUse) {
        if (new RegExp(address).test(destination)) {
          return false;
        }
      }
    }
    return true;
  }
}