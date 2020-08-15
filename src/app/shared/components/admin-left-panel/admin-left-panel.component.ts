import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { environment } from '@env/environment';
import { APIService, DataService, SideNavService, LoadingService, SnakebarService } from '@shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-left-panel',
  templateUrl: './admin-left-panel.component.html',
  styleUrls: ['./admin-left-panel.component.scss'],
})
export class AdminLeftPanelComponent implements OnInit {
  events = [];

  constructor(
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private ds: DataService,
    private apiService: APIService,
    private router: Router,
    private toolbarService: SideNavService) {
    this.getSettingData();
    this.router.events.subscribe(event => {
    });
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    if (this.router.url == '/dashboard') {
      this._loadingService.show();
    }
    this.apiService.ApiCall('', environment.apiUrl + 'event', 'get').subscribe(
      result => {
        if (result.success) {
          this.events = result.data;
          if (this.router.url == '/dashboard') {
            this._loadingService.hide();
          }
        }
      },
      err => {
      }
    );
  }

  setEventData(data) {
    this.ds.changeEvent(data);
  }

  closeNav() {
    this.toolbarService.close();
  }

  getSettingData() {
    this.apiService.ApiCall({}, `${environment.apiUrl}setting`, 'get').subscribe(res => {
      this._loadingService.hide();
      if (res.success) {
        this.ds.changeSettingData(res.data);
      } else {
        this._snakebarService.show("error", res.message);
      }
    }, err => {
      this._snakebarService.show("error", err.message);
    });
  }

}
