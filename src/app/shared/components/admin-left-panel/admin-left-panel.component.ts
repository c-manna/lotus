import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { environment } from '@env/environment';
import { APIService, DataService, SideNavService, LoadingService, SnakebarService } from '@shared/services';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-left-panel',
  templateUrl: './admin-left-panel.component.html',
  styleUrls: ['./admin-left-panel.component.scss'],
})
export class AdminLeftPanelComponent implements OnInit {
  events = [{ "eventType": "1", "name": "Soccer", "marketCount": 2492 }, { "eventType": "2", "name": "Tennis", "marketCount": 5578 }, { "eventType": "4", "name": "Cricket", "marketCount": 22 }, { "eventType": "7", "name": "Horse Racing", "marketCount": 831 }, { "eventType": "4339", "name": "Greyhound Racing", "marketCount": 298 }];
  _routeListener: Subscription;
  constructor(
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private ds: DataService,
    private apiService: APIService,
    private router: Router,
    private toolbarService: SideNavService) {
    /*     this.router.events.subscribe(event => {
        }); */
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    if (this.router.url == '/dashboard') {
      this._loadingService.show();
    }
    this._routeListener = this.apiService.ApiCall('', environment.apiUrl + 'event', 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.events = result.data;
          if (this.router.url == '/dashboard') {
            this._loadingService.hide();
          }
        }
      },
      err => {
        this._loadingService.hide();
      }
    );
  }

  setEventData(data) {
    this.ds.changeEvent(data);
  }

  closeNav() {
    this.toolbarService.close();
  }
  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }
}
