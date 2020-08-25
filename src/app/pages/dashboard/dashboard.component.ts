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
  // events = [];
  events = [{ "eventType": "1", "name": "Soccer", "marketCount": 2492 }, { "eventType": "2", "name": "Tennis", "marketCount": 5578 }, { "eventType": "4", "name": "Cricket", "marketCount": 22 }, { "eventType": "7", "name": "Horse Racing", "marketCount": 831 }, { "eventType": "4339", "name": "Greyhound Racing", "marketCount": 298 }];
  dataList: any = [];
  selectedItem: any = {};
  inplayInterval: any;
  refreshDataInterval: any;
  loading: boolean = true;
  openBetList: any = [];
  constructor(
    private _snakebarService: SnakebarService,
    private _loadingService: LoadingService,
    private _cookieService: CookieService,
    private _apiService: APIService,
  ) {
    this.getInPlay();
  }

  ngOnInit(): void {
    this.inplayTime();
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
      if (this.loading) this.getEvents();
      this.loading = false;
      if (res.success) {
        let resData = res['data'];
        resData.forEach(item => {
          let index = this.events.findIndex(event => { return (event.eventType == item.event_id) });
          item['name'] = this.events[index].name;
          item['marketCount'] = this.events[index].marketCount;
        });
        this.dataList = resData;
        this.refreshData();
        // console.log("this.dataList==", this.dataList)
      } else {
        this._snakebarService.show("error", res.message);
      }
    }, err => {
      if (this.loading) this._loadingService.hide();
      this._snakebarService.show("error", err.message);
    });
  }

  getMatchOdds(index, index1, eventId, competitionId, marketID) {
    this._apiService.ApiCall('', environment.apiUrl + 'fetch-market-odds?eventID=' + eventId + '&competitionId=' + competitionId + '&marketID=' + marketID, 'get').subscribe(
      result => {
        if (result.success) {
          this.dataList[index].inplay_data[index1].inPlay_data = result["data"][0];
        }
      }, err => { }
    );
  }

  inplayTime() {
    this.inplayInterval = setInterval(() => {
      this.getInPlay();
    }, 60000);
    this.refreshDataInterval = setInterval(() => {
      this.refreshData();
    }, 5000);
  }

  refreshData() {
    this.dataList.forEach((item, index) => {
      item.inplay_data.forEach((eachMatch, index1) => {
        this.getMatchOdds(index, index1, item.event_id, eachMatch.competetion_id, eachMatch.inPlay_data.marketId);
      });
    });
  }

  canceBet() {
    console.log("canceBet");
    this.createBetFormActive = 0;
  }

  openCreateBetForm(viewMode, value, type, item, eachItem) {
    // let currentTime = Date.now();
    // this.selectedItem = { type: type, ...item, value: value };
    // eachItem['viewMode'] = viewMode;
    // item['createBetFormActive'] = currentTime;
    // eachItem['createBetFormActive'] = currentTime;
    // this.createBetFormActive = currentTime;


    // this.profile_and_loss = [];
    // //console.log(this.matchesDetails)
    // this.details.marketId = this.matchesDetails[0].marketId;
    // this.details.market_start_time = this.matchesDetails[0].marketStartTime;
    // this.details.market_type = this.matchesDetails[0].marketName;
    // this.details.runnerName = runnerName;
    // this.details.runners = this.matchesDetails[0].runners;
    // this.details.index = index;
    // let user = JSON.parse(this._cookieService.get("user"))
    // this.details.user_id = user.punter_id;
    // this.details.punter_belongs_to = user.punter_belongs_to;
    // let currentTime = Date.now();
    // this.selectedItem = { type: type, ...item, value: value };
    // item['viewMode'] = viewMode;
    // item['createBetFormActive'] = currentTime;
    // this.createBetFormActive = currentTime;
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
    clearInterval(this.refreshDataInterval);
  }

}
