import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(
    private http: HttpClient) { }

  ApiCall(data: any, route: any, method: any) {
    switch (method) {
      case "post":
        return this.http.post(route, data)
          .pipe(
            timeout(environment.api_timeout),
            catchError((e) => { return throwError(e) }),
            map((response: any) => response)
          )
      case "get":
        return this.http.get(route)
          .pipe(
            timeout(environment.api_timeout),
            catchError((e) => { return throwError(e) }),
            map((response: any) => response)
          )
      case "put":
        return this.http.put(route, data)
          .pipe(
            timeout(environment.api_timeout),
            catchError((e) => { return throwError(e) }),
            map((response: any) => response)
          )
      case "delete":
        return this.http.delete(route)
          .pipe(
            timeout(environment.api_timeout),
            catchError((e) => { return throwError(e) }),
            map((response: any) => response)
          )
    }
  }

}
