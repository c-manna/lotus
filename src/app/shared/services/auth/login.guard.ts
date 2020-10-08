import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router : Router ,private cookieService : CookieService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    let admin_token = this.cookieService.get('token');   
    if(admin_token!= undefined && admin_token!=null && admin_token!=""){
      this.router.navigate(['/dashboard']);
      return false;
    }else{
      return true;
    }
  }
}
