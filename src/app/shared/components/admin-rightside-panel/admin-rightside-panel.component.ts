import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService, DataService, SideNavService } from '@shared/services';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admin-rightside-panel',
  templateUrl: './admin-rightside-panel.component.html',
  styleUrls: ['./admin-rightside-panel.component.scss']
})
export class AdminRightsidePanelComponent implements OnInit {
  user:any={};

  constructor(private ds: DataService,
    private apiService: APIService,
    private _router: Router,
    private toolbarService: SideNavService,
    private _cookieService: CookieService
  ) {
  }

  ngOnInit() {
    this.user=JSON.parse(this._cookieService.get("user"));
  }

  closeNav() {
    this.toolbarService.close();
  }

  /* Logout Admin user */
  logout() {
    this.closeNav();
    this._cookieService.deleteAll();
    this._router.navigate(["/"]);
  }
}
