import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { SnakebarService, LoadingService } from '@app/shared/services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '@app/shared/services/socket.service';
import { APIService, CommonService, DataService } from '@app/shared/services';
import { environment } from '@env/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  createBetFormActive: any;
  events: any = [];
  dataList: any = [];
  inplayInterval: any;
  refreshDataInterval: any;
  loading: boolean = true;
  OpenBetLength$: number = 0;
  openBetPlaceDialog = false;
  selectedItem: any={};
  details: any = {};
  settingData;
  maxBetMaxMarket: any = [];
  current_exposure: any = [];
  maxBetMaxMarketFinal: any = [];
  currentTime:any;

  constructor(
    private commonService: CommonService,
    private ds: DataService,
    private _snakebarService: SnakebarService,
    private _loadingService: LoadingService,
    private _cookieService: CookieService,
    private _apiService: APIService,
  ) {
    this.getSettingData();
    let user = JSON.parse(this._cookieService.get("user"))
    this.details.user_id = user.punter_id;
    this.details.punter_belongs_to = user.punter_belongs_to;
    this.ds.events$.subscribe(data => {
      this.events = data;
      if (this.events) this.getInPlay();
    });
    this.commonService.getOpenBets();
    this.ds.openBetLength$.subscribe(data => {
      this.OpenBetLength$ = data;
    });
    this.getMaxbetMaxMarket();
  }

  ngOnInit(): void {
    this.inplayTime();
  }

  set_profit_loss(data) {
  }

  getSettingData() {
    this.ds.settingData$.subscribe(data => {
      this.settingData = data;
      if (this.settingData == null) {
        this.commonService.getSettingData();
      }
    });
  }

  getMaxbetMaxMarket() {
    let param: any = {};
    param.event_id = -1;
    this._apiService.ApiCall(param, environment.apiUrl + 'getMaxBetMaxMarket', 'post').subscribe(
      result => {
        console.log(result);
        this.maxBetMaxMarket = result.result;
        //this.maxBetMaxMarket['Match Odds'] = result.result.find(obj => obj.market == 'Match Odds') == undefined ? { status: false } : result.result.find(obj => obj.market == 'Match Odds');
        // this.maxBetMaxMarket['fancy'] = result.result.find(obj => obj.market == 'fancy') == undefined ? { status: false } : result.result.find(obj => obj.market == 'fancy');
        // this.maxBetMaxMarket['bookmaker'] = result.result.find(obj => obj.market == 'bookmaker') == undefined ? { status: false } : result.result.find(obj => obj.market == 'bookmaker');
        //console.log(this.maxBetMaxMarket)
      }, err => { }
    );
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
        this.refreshData();
        console.log("this.dataList==", this.dataList)
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
          if(this.selectedItem && this.selectedItem.dataList_i!='undefined' && this.selectedItem.dataList_j!='undefined')
            this.ds.changeMatchOdds([this.dataList[this.selectedItem.dataList_i].inplay_data[this.selectedItem.dataList_j].inPlay_data]);
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
    this.openBetPlaceDialog = false;
    this.selectedItem = '';
    this.currentTime = null;
  }

  
  trackByFn(index, entity) {
    return entity.id;
  }

  openCreateBetForm(value, type, item, runnerName, index, fragment, eachMatch,dataList_i,dataList_j,event_name) {
    this.current_exposure = [];
    this.details.marketId = eachMatch.runner_details.marketId;
    this.details.market_start_time = eachMatch.runner_details.marketStartTime;
    this.details.runners = eachMatch.runner_details.runners;
    this.details.index = index;
    this.details.fragment = fragment;
    this.details.market_type = eachMatch.runner_details.marketName;
    this.details.runnerName = runnerName;
    this.details.event_id = eachMatch.event_id;
    this.maxBetMaxMarketFinal = [];
    this.maxBetMaxMarketFinal = this.maxBetMaxMarket.find(obj => obj.event == eachMatch.event_id) == undefined ? { status: false } : this.maxBetMaxMarket.find(obj => obj.event == eachMatch.event_id);
    this.details.event_name = event_name;
    this.details.description = eachMatch.match_name;
    this.details.competition_id = eachMatch.competetion_id;
    this.details.match_id = eachMatch.match_id;
    let currentTime= new Date().getTime();
    this.currentTime = currentTime;
    eachMatch.currentTime = currentTime;
    this.selectedItem = { type: type, ...item, value: value,dataList_i:  dataList_i,dataList_j:  dataList_j};
    this.current_exposure = [];
    this.details.runners.forEach(element => {
      this.current_exposure.push("0.00");
    });

    
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
