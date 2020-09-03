import { Component, OnInit, Input } from '@angular/core';
import { DataService, APIService, CommonService, LoadingService } from '@shared/services';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

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
  current_exposure: any=[];
  previous_exposure: any=[];
  settingData;
  previousBet: any;
  ladderContent: boolean = false;
  ladderTable: any = [];
  eventData: any;

  constructor(private ds: DataService,
    private apiService: APIService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private _loadingService: LoadingService,
    private _cookieService: CookieService
  ) {
    this.getSettingData();
    let user = JSON.parse(this._cookieService.get("user"))
    this.details.user_id = user.punter_id;
    this.details.punter_belongs_to = user.punter_belongs_to;
  }

  ngOnInit(): void {
    this.ds.event$.subscribe(event => {
      this.eventData = event;
      //console.log(this.eventData)
    });
    this.ds.eventDeatils$.subscribe(event => {
      this.eventDeatils = event;
    });
    //console.log(this.matchesDetails)
  }

  ngOnChanges() {
    //console.log(this.maxBetMaxMarket)
  }

  getSettingData() {
    this.ds.settingData$.subscribe(data => {
      this.settingData = data;
      if (this.settingData == null) {
        this.commonService.getSettingData();
      }
    });
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
    console.log(data);
    if (this.details.market_type != 'fancy') {
      for (let i = 0; i < this.matchesDetails[this.details.index].runners.length; i++) {
        if(data.previous.length){
          this.previous_exposure[i] = data.previous[i];
        }
        this.current_exposure[i] = data.current[i];
      }
    } /* else {
      for (let i = 0; i < this.fancyMatch.length; i++) {
        if (data.index == i)
          this.profile_and_loss[i] = data.loss;
        else
          this.profile_and_loss[i] = data.loss;
      }
    } */
  }

  openCreateBetForm(value, type, item, runnerName, index, fragment, market_type) {
    this.current_exposure = [];
    this.details.marketId = this.matchesDetails[index].marketId;
    this.details.market_start_time = this.matchesDetails[index].marketStartTime;
    this.details.market_type = market_type;
    this.details.runnerName = runnerName;
    this.details.runners = this.matchesDetails[index].runners;
    this.details.index = index;
    this.details.fragment = fragment;
    this.details.event_id = this.eventData.eventType;
    this.details.event_name = this.eventData.name;
    this.details.description = this.eventDeatils.event.name;
    this.details.competition_id = this.route.snapshot.params['competitionId'];
    this.details.match_id = this.route.snapshot.params['matchId'];
    this.selectedItem = { type: type, ...item, value: value };
  }

  openCreateBetFormFancy(value, type, item, runnerName, index, market_type) {
    this.ladderContent = false;
    this.current_exposure = [];
    this.details.marketId = item.SelectionId;
    this.details.market_type = market_type;
    this.details.runnerName = runnerName;
    this.details.index = index;
    this.details.event_id = this.eventData.eventType;
    this.details.event_name = this.eventData.name;
    this.details.description = this.eventDeatils.event.name;
    this.details.competition_id = this.route.snapshot.params['competitionId'];
    this.details.match_id = this.route.snapshot.params['matchId'];
    this.selectedItem = { type: type, ...item, value: value };
  }

  showLader(SelectionId, index) {
    this.ladderContent = (this.details.index === index || this.details.index === undefined) ? !this.ladderContent : this.details.index != index ? true : this.ladderContent;
    this.details.index = index;
    this.openBetPlaceDialogForFancy = false;
    if (this.ladderContent) {
      let param: any = {};
      param.user_id = this.details.user_id;
      param.match_id = this.route.snapshot.params['matchId'];
      param.selection_id = SelectionId;
      this.ladderTable = [];
      this.commonService.getExposureForFancy(param, (result) => {
        let previousBetFancy = result;
        if (previousBetFancy.length > 0) {
          //console.log(previousBetFancy)
          let ladderTable: any = [];
          for (let i = 0; i < previousBetFancy.length; i++) {
            if (i == 0) {
              ladderTable.push({ from: 0, to: previousBetFancy[i].placed_odd - 1 })
            } else {
              if (i + 1 <= previousBetFancy.length - 1) {
                if (previousBetFancy[i - 1].placed_odd != previousBetFancy[i].placed_odd) {
                  ladderTable.push({ from: previousBetFancy[i - 1].placed_odd, to: previousBetFancy[i].placed_odd - 1 })
                }
              }
            }
          }
          if (previousBetFancy[previousBetFancy.length - 2].placed_odd == previousBetFancy[previousBetFancy.length - 1].placed_odd) {
            ladderTable.push({ from: '', to: previousBetFancy[previousBetFancy.length - 1].placed_odd });
          } else {
            ladderTable.push({ from: previousBetFancy[previousBetFancy.length - 2].placed_odd, to: previousBetFancy[previousBetFancy.length - 1].placed_odd });
          }

          for (let i = 0; i < previousBetFancy.length; i++) {
            for (let j = 0; j < ladderTable.length; j++) {
              if (previousBetFancy[i].odd == 0) {
                if (ladderTable[j].to >= previousBetFancy[i].placed_odd) {
                  ladderTable[j][i] = previousBetFancy[i].price / 100 * previousBetFancy[i].stake;
                }
                else {
                  ladderTable[j][i] = -Math.abs(previousBetFancy[i].stake);
                }
              }
              else {
                if (ladderTable[j].to < previousBetFancy[i].placed_odd) {
                  ladderTable[j][i] = previousBetFancy[i].price / 100 * previousBetFancy[i].stake;
                }
                else {
                  ladderTable[j][i] = -Math.abs(previousBetFancy[i].stake);
                }
              }
            }
          }
          let all_amount: any = [];
          for (let i = 0; i < ladderTable.length; i++) {
            for (let j = 0; j < previousBetFancy.length; j++) {
              if (j == 0) {
                ladderTable[i]["result"] = ladderTable[i][j];
              } else {
                ladderTable[i]["result"] += ladderTable[i][j];
                all_amount[i] = ladderTable[i]["result"];
              }
            }
          }
          this.ladderTable = ladderTable;
          console.log(ladderTable)
        }
      });
    }
  }

}
