import { Component, OnInit, Input } from '@angular/core';
import { DataService, APIService } from '@shared/services';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-market-live-section',
  templateUrl: './market-live-section.component.html',
  styleUrls: ['./market-live-section.component.scss']
})
export class MarketLiveSectionComponent implements OnInit {
  @Input() matchesDetails: any = [];
  createBetFormActive: any;
  selectedItem: any;
  details: any = {};
  eventDeatils: any;
  openBetPlaceDialog = false;
  openBetPlaceDialogForBookMaker = false;
  profile_and_loss: any = [];
  settingData: any = {};
  maxBetMaxMarket: any = [];
  previousBet: any;

  constructor(private ds: DataService,
    private apiService: APIService,
    private _cookieService: CookieService
  ) {
    let user = JSON.parse(this._cookieService.get("user"))
    this.details.user_id = user.punter_id;
  }

  ngOnInit(): void {
    this.ds.eventDeatils$.subscribe(event => {
      this.eventDeatils = event;
      this.getExposure();
      this.getMaxbetMaxMarket();
    });
    this.getSettingData();
  }

  ngOnChanges() { }

  getExposure() {
    let param: any = {};
    param.user_id = this.details.user_id;
    param.match_id = this.eventDeatils.event.id;

    this.apiService.ApiCall(param, environment.apiUrl + 'getexposure', 'post').subscribe(
      result => {
        if (result.success) {
          this.previousBet = result.result;
        }
      },
      err => { }
    );
  }

  getSettingData() {
    this.apiService.ApiCall({}, `${environment.apiUrl}setting`, 'get').subscribe(res => {
      if (res.success) { this.settingData = res.data; }
    }, err => { });
  }

  trackByFn(index, entity) {
    return entity.id;
  }

  canceBet() {
    this.openBetPlaceDialog = false;
    this.profile_and_loss = [];
  }
  canceBetForBookMaker() {
    this.openBetPlaceDialogForBookMaker = false;
    this.profile_and_loss = [];
  }
  set_profit_loss(data) {
    console.log(data);
    for (let i = 0; i < this.matchesDetails[0].runners.length; i++) {
      if (data.index == i)
        this.profile_and_loss[i] = data.value;
      else
        this.profile_and_loss[i] = data.stake;
    }
  }

  openCreateBetForm(viewMode, value, type, item, runnerName, index, market) {
    this.profile_and_loss = [];
    //console.log(this.matchesDetails)
    this.details.marketId = this.matchesDetails[0].marketId;
    this.details.market_start_time = this.matchesDetails[0].marketStartTime;
    this.details.market_type = this.matchesDetails[0].marketName;
    this.details.runnerName = runnerName;
    this.details.runners = this.matchesDetails[0].runners;
    this.details.index = index;
    let user = JSON.parse(this._cookieService.get("user"))
    this.details.user_id = user.punter_id;
    this.details.punter_belongs_to = user.punter_belongs_to;
    let currentTime = Date.now();
    this.selectedItem = { type: type, ...item, value: value };
    item['viewMode'] = viewMode;
    item['createBetFormActive'] = currentTime;
    this.createBetFormActive = currentTime;
  }

  getMaxbetMaxMarket() {
    let param: any = {};
    param.event_id = parseInt(this.eventDeatils.event.event_type);
    this.apiService.ApiCall(param, environment.apiUrl + 'getMaxBetMaxMarket', 'post').subscribe(
      result => {
        console.log(result);
        this.maxBetMaxMarket['Match Odds'] = result.result.find(obj => obj.market == 'Match Odds');
        this.maxBetMaxMarket['fancy'] = result.result.find(obj => obj.market == 'fancy');
        this.maxBetMaxMarket['bookmaker'] = result.result.find(obj => obj.market == 'bookmaker');
      }, err => {
        //this._snakebarService.show('error', err);
      }
    );
  }

}
