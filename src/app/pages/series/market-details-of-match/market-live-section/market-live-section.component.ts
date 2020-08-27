import { Component, OnInit, Input } from '@angular/core';
import { DataService, APIService, CommonService } from '@shared/services';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-market-live-section',
  templateUrl: './market-live-section.component.html',
  styleUrls: ['./market-live-section.component.scss']
})
export class MarketLiveSectionComponent implements OnInit {
  @Input() matchesDetails: any = [];
  @Input() matchOdds: any;
  @Input('fancyMatch') fancyMatch: any;
  @Input() bookMakerMatch: any;
  @Input() maxBetMaxMarket: any;
  //createBetFormActive: any;
  selectedItem: any;
  details: any = {};
  eventDeatils: any;
  openBetPlaceDialog = false;
  openBetPlaceDialogForBookMaker = false;
  openBetPlaceDialogForFancy = false;
  profile_and_loss: any = [];
  settingData;
  previousBet: any;
  previousBetFancy: any;
  ladderContent:boolean=false;

  constructor(private ds: DataService,
    private apiService: APIService,
    private commonService: CommonService,
    private _cookieService: CookieService
  ) {
    this.getSettingData();
    let user = JSON.parse(this._cookieService.get("user"))
    this.details.user_id = user.punter_id;
    this.details.punter_belongs_to = user.punter_belongs_to;
  }

  ngOnInit(): void {
    this.ds.eventDeatils$.subscribe(event => {
      this.eventDeatils = event;
      this.getExposure();
    });
    //console.log(this.matchesDetails)
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
  }
  canceBetForBookMaker() {
    this.openBetPlaceDialogForBookMaker = false;
  }
  canceBetForFancy() {
    this.openBetPlaceDialogForFancy = false;
  }
  set_profit_loss(data) {
    //console.log(data);
    if (this.details.market_type != 'fancy') {
      for (let i = 0; i < this.matchesDetails[0].runners.length; i++) {
        if (data.index == i)
          this.profile_and_loss[i] = data.value;
        else
          this.profile_and_loss[i] = data.stake;
      }
    } else {
      for (let i = 0; i < this.fancyMatch.length; i++) {
        if (data.index == i)
          this.profile_and_loss[i] = data.loss;
        else
          this.profile_and_loss[i] = data.loss;
      }
    }
  }

  openCreateBetForm(value, type, item, runnerName, index, market_type) {
    this.profile_and_loss = [];
    this.details.marketId = this.matchesDetails[0].marketId;
    this.details.market_start_time = this.matchesDetails[0].marketStartTime;
    this.details.market_type = market_type;//this.matchesDetails[0].marketName;
    this.details.runnerName = runnerName;
    this.details.runners = this.matchesDetails[0].runners;
    this.details.index = index;
    this.selectedItem = { type: type, ...item, value: value };
    //let currentTime = Date.now();
    // item['viewMode'] = viewMode;
    // item['createBetFormActive'] = currentTime;
    // this.createBetFormActive = currentTime;
  }

  openCreateBetFormFancy(value, type, item, runnerName, index, market_type) {
    this.ladderContent=false;
    this.getExposureForFancy(item.SelectionId);
    this.profile_and_loss = [];
    this.details.marketId = item.SelectionId;
    this.details.market_type = market_type;
    this.details.runnerName = runnerName;
    this.details.index = index;
    this.selectedItem = { type: type, ...item, value: value };
  }

  getExposureForFancy(param, callback: any = null) {
    this.apiService.ApiCall(param, environment.apiUrl + 'getExposureFancy', 'post').subscribe(
      result => {
        if (result.success) {
          this.previousBetFancy = result.result;
          console.log('call back')
          if (callback != null) { callback(); }
        }
      },
      err => { }
    );
  }

  showLader(SelectionId) {
    this.ladderContent=!this.ladderContent;
    this.openBetPlaceDialogForFancy=false;
    let param: any = {};
    param.user_id = this.details.user_id;
    param.match_id = this.eventDeatils.event.id;
    param.selection_id = SelectionId;
    this.commonService.getExposureForFancy(param, (result) => {
      this.previousBetFancy = result;
      if (this.previousBetFancy.length > 0) {
        console.log(this.previousBetFancy)
        let ladderTable: any = [];
        for (let i = 0; i < this.previousBetFancy.length; i++) {
          if (i == 0) {
            ladderTable.push({ from: 0, to: this.previousBetFancy[i].placed_odd - 1 })
          } else {
            ladderTable.push({ from: this.previousBetFancy[i - 1].placed_odd, to: this.previousBetFancy[i].placed_odd - 1 })
          }
        }
        ladderTable.push({ from: this.previousBetFancy[this.previousBetFancy.length - 1].placed_odd, to: this.previousBetFancy[this.previousBetFancy.length - 1].placed_odd });
        console.log(ladderTable)
        for (let i = 0; i < this.previousBetFancy.length; i++) {
          for (let j = 0; j < ladderTable.length; j++) {
            if (this.previousBetFancy[i].odd == 0) {
              if(ladderTable[j].to>=this.previousBetFancy[i].placed_odd){
                ladderTable[j][i] = this.previousBetFancy[i].price/100*this.previousBetFancy[i].stake;
              }
              else{
                ladderTable[j][i] = -Math.abs(this.previousBetFancy[i].stake);
              }
            }
            else {
              if(ladderTable[j].to<this.previousBetFancy[i].placed_odd){
                ladderTable[j][i] = this.previousBetFancy[i].price/100*this.previousBetFancy[i].stake;
              }
              else{
                ladderTable[j][i] = -Math.abs(this.previousBetFancy[i].stake);
              }
            }
          }
        }
        let all_amount: any = [];
        for(let i=0;i<ladderTable.length;i++){
          for(let j=0;j<this.previousBetFancy.length;j++){
            if(j==0){
              ladderTable[i]["result"]=ladderTable[i][j];
            }else{
              ladderTable[i]["result"]+=ladderTable[i][j];
              all_amount[i]=ladderTable[i]["result"];
            }
          }
        }
        console.log(this.min(all_amount))
        console.log(ladderTable)
      }
    });
  }

  min(input) {
    if (toString.call(input) !== "[object Array]")
      return false;
    return Math.min.apply(null, input);
  }

}
