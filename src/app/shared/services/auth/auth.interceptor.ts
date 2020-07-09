import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    

    let tokenReq : any ;
    
    tokenReq = request.clone({
  		setHeaders:{
        //'Content-Type' : 'application/json; charset=utf-8;multipart/form-data',
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Accept'       : 'application/json',
        //'Access-Control-Allow-Origin' : '*',
        //'Access-Control-Allow-Method': "'POST', 'GET'",
        'Authorization': 'Bearer '+localStorage.getItem('access_token'),
  		}
    });

    return next.handle(tokenReq);
  }

}