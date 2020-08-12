import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, timeout, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs'
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private router: Router, private http: HttpClient) { }

  queryParams(source: any) {
    var array = [];
    for (var key in source) {
      array.push(encodeURIComponent(key) + "=" + encodeURIComponent(source[key]));
    }
    return array.join("&");
  }


  /**
    * Date : 15-03-2019
    * param data : data for post
    * param route : api url to call
    * param method : method to call like post/put/get/delete
    */
  ApiCall(data: any, route: any, method: any, headertoken: any = undefined) {

    if (headertoken == undefined) {

      if (method == 'post') {
        return this.http.post(route, data)
          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }
      else if (method == 'get') {
        return this.http.get(route)
          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }
      else if (method == 'put') {
        return this.http.put(route, data)
          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }
      else if (method == 'delete') {
        return this.http.delete(route)
          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }
      else {
        return this.http.post(route, data)
          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }
    }
    else {


      let httpHeaderValue = new HttpHeaders();
      httpHeaderValue = httpHeaderValue.set('Content-Type', 'application/json')
        .set('authorization', 'Bearer ' + headertoken);

      if (method == 'post') {
        return this.http.post(route, data, { headers: httpHeaderValue })

          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }
      else if (method == 'get') {
        return this.http.get(route, { headers: httpHeaderValue })
          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }
      else if (method == 'put') {
        return this.http.put(route, data, { headers: httpHeaderValue })
          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }
      else if (method == 'delete') {
        return this.http.delete(route, { headers: httpHeaderValue })
          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }
      else {
        return this.http.post(route, data, { headers: httpHeaderValue })
          .pipe(
            timeout(environment.api_timeout),
            catchError((e, c) => { return throwError(e) }),
            map((response: any) => response)
          )
        //.pipe(map((response: any) => response));
      }

    }//.End of If else

  }// .End of ApiCall()


  /**
   * Date : 12-05-2020
   * param data : data for post
   * param route : api url to call
   * param method : method to call like post/put/get/delete
   */
  FileUploadApiCall(data: any, route: any, method: any, headertoken: any = undefined) {

    let httpHeaderValue = new HttpHeaders();
    httpHeaderValue = httpHeaderValue.set('authorization', 'Bearer ' + headertoken);


    if (method == 'post') {
      return this.http.post(route, data, { headers: httpHeaderValue })

        .pipe(
          timeout(environment.api_timeout),
          catchError((e, c) => { return throwError(e) }),
          map((response: any) => response)
        )
      //.pipe(map((response: any) => response));
    }
    else if (method == 'get') {
      return this.http.get(route, { headers: httpHeaderValue })
        .pipe(
          timeout(environment.api_timeout),
          catchError((e, c) => { return throwError(e) }),
          map((response: any) => response)
        )
      //.pipe(map((response: any) => response));
    }
    else if (method == 'put') {
      return this.http.put(route, data, { headers: httpHeaderValue })
        .pipe(
          timeout(environment.api_timeout),
          catchError((e, c) => { return throwError(e) }),
          map((response: any) => response)
        )
      //.pipe(map((response: any) => response));
    }
    else if (method == 'delete') {
      return this.http.delete(route, { headers: httpHeaderValue })
        .pipe(
          timeout(environment.api_timeout),
          catchError((e, c) => { return throwError(e) }),
          map((response: any) => response)
        )
      //.pipe(map((response: any) => response));
    }
    else {
      return this.http.post(route, data, { headers: httpHeaderValue })
        .pipe(
          timeout(environment.api_timeout),
          catchError((e, c) => { return throwError(e) }),
          map((response: any) => response)
        )
      //.pipe(map((response: any) => response));
    }


  }// .End of ApiCall()


}
