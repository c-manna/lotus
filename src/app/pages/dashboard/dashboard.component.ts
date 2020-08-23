import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { SnakebarService, LoadingService } from '@app/shared/services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '@app/shared/services/socket.service';
import { APIService } from '@app/shared/services/api.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  createBetFormActive: any;
  // eventId = 1;
  events = [];
  dataList: any = [];
  selectedItem: any = {};
  inplayInterval: any;
  loading: boolean = true;
  openBetList: any = [];
  constructor(
    private _snakebarService: SnakebarService,
    private _loadingService: LoadingService,
    private _cookieService: CookieService,
    private _apiService: APIService,
  ) { }

  ngOnInit(): void {
    this.getEvents();
    this.getOpenBets();
  }

  getOpenBets() {
    this._apiService.ApiCall({}, environment.apiUrl + 'open-bet', 'get').subscribe(
      result => {
        if (result.success) {
          this.openBetList = result['data'];
        }
      }, err => { });
  }

  getEvents() {
    // this._loadingService.show();
    this._apiService.ApiCall('', environment.apiUrl + 'event', 'get').subscribe(result => {
      // this._loadingService.hide();
      if (result.success) {
        this.events = result.data;
        this.getInPlay();
        this.inplayTime();
      }
    }, err => {
      // this._loadingService.hide();
    });
  }

  getInPlay() {
    if (this.loading) this._loadingService.show();
    this._apiService.ApiCall({}, `${environment.apiUrl}inplay-match`, 'get').subscribe(res => {
      // this._apiService.ApiCall({}, `${environment.apiUrl}fetch-inplay?eventID=${this.eventId}`, 'get').subscribe(res => {
      if (this.loading) this._loadingService.hide();
      this.loading = false;
      if (res.success) {
        let resData = res['data'];
        resData.forEach(item => {
          let index = this.events.findIndex(event => { return (event.eventType == item.event_id) });
          item['name'] = this.events[index].name;
          item['marketCount'] = this.events[index].marketCount;
        });
        this.dataList = resData;
        // console.log("this.dataList==", this.dataList)
      } else {
        this._snakebarService.show("error", res.message);
      }
    }, err => {
      if (this.loading) this._loadingService.hide();
      this._snakebarService.show("error", err.message);
    });
  }

  inplayTime() {
    this.inplayInterval = setInterval(() => {
      this.getInPlay();
    }, 5000);
  }

  canceBet() {
    console.log("canceBet");
    this.createBetFormActive = 0;
  }

  openCreateBetForm(viewMode, value, type, item, eachItem) {
    let currentTime = Date.now();
    this.selectedItem = { type: type, ...item, value: value };
    eachItem['viewMode'] = viewMode;
    item['createBetFormActive'] = currentTime;
    eachItem['createBetFormActive'] = currentTime;
    this.createBetFormActive = currentTime;
  }

  showMatchName(matchName, team) {
    let index = matchName.indexOf(" v ")
    if (team == 1) {
      return matchName.substring(0, index);
    } else {
      return matchName.substring(index + 3);
    }
  }

  showIcon(name) {
    if (name == 'Soccer') return 'assets/icons/football.svg';
    else if (name == 'Cricket') return 'assets/icons/cricket.svg';
    else if (name == 'Tennis') return 'assets/icons/tennis.svg';
    else if (name == 'Horse Racing') return 'assets/icons/horse.svg';
    else if (name == 'Greyhound Racing') return 'assets/icons/greyhound_1.svg';
    else return '';
  }

  ngOnDestroy(): void {
    clearInterval(this.inplayInterval);
  }

}
