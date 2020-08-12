import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let user_id = this.cookieService.get('user'); 
    if(user_id == undefined ||  user_id == null ||  user_id ==""){
      this.cookieService.delete( 'token','/', environment.siteroot  );
    }

    let admin_token = this.cookieService.get('token');
    console.log(admin_token)
    if (admin_token == undefined || admin_token == null || admin_token == "") {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
