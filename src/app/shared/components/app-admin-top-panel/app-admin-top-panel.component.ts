import { Component, OnInit } from '@angular/core';
import { SideNavService } from '@shared/services';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DataService } from '@shared/services';

@Component({
  selector: 'app-app-admin-top-panel',
  templateUrl: './app-admin-top-panel.component.html',
  styleUrls: ['./app-admin-top-panel.component.scss']
})
export class AppAdminTopPanelComponent implements OnInit {
  url;
  balanceInfo = {};

  constructor(
    private ds: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private toolbarService: SideNavService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url = this.router.url.split('/');
      }
    });
  }

  ngOnInit(): void {
    this.ds.balanceInfo$.subscribe(data => {
      this.balanceInfo = data;
    });
  }

  toggleDrawer() {
    this.toolbarService.toggle();
    // this.toolbarService.close();
  }

  toggleDrawer1() {
    this.toolbarService.toggle1();
    // this.toolbarService.toggle();
  }

  backClicked() {
    this._location.back();
  }
}
