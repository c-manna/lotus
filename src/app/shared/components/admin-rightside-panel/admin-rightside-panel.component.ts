import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { APIService, DataService, SideNavService } from '@shared/services';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-rightside-panel',
  templateUrl: './admin-rightside-panel.component.html',
  styleUrls: ['./admin-rightside-panel.component.scss']
})
export class AdminRightsidePanelComponent implements OnInit {
  user: any = {};
  userBalance: any = {};
  _routeListener: Subscription;
  constructor(private ds: DataService,
    private apiService: APIService,
    private _router: Router,
    private toolbarService: SideNavService,
    private _cookieService: CookieService,
    private router: Router,
  ) {
    this._routeListener = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.user = JSON.parse(this._cookieService.get("user"));
        this.getUserBalance();
      }
    });
  }

  ngOnInit() { }

  closeNav() {
    this.toolbarService.close();
  }

  /* Logout Admin user */
  logout() {
    this.closeNav();
    this._cookieService.deleteAll();
    this._router.navigate(["/"]);
  }
  getUserBalance() {
    let param: any = {};
    param.user_id = this.user.punter_id;
    this.apiService.ApiCall(param, `${environment.apiUrl}getbalanceDetails`, 'post').subscribe(res => {
      if (res.success) {
        this.userBalance = res.result;
        console.log(res.data)
      } else {
      }
    }, err => {
    });
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }
}
