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
  current_exposure: any = [];
  previous_exposure: any = [];
  settingData;
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
    this.selectedItem = '';
  }
  canceBetForBookMaker() {
    this.openBetPlaceDialogForBookMaker = false;
    this.selectedItem = '';
  }
  canceBetForFancy() {
    this.openBetPlaceDialogForFancy = false;
    this.selectedItem = '';
  }
  set_profit_loss(data) {
    //console.log(data);
    if (this.details.market_type != 'fancy') {
      for (let i = 0; i < this.matchesDetails[this.details.index].runners.length; i++) {
        if (data.previous.length) {
          this.previous_exposure[i] = data.previous[i];
        }
        if (data.current[i] != undefined) {
          this.current_exposure[i] = data.current[i];
        } else {
          this.current_exposure[i] = "0.00";
        }
      }
    }else{
      console.log(data)
      for (let i = 0; i < this.fancyMatch.length; i++) {
          this.previous_exposure[i] = data.previous;
          this.current_exposure[i] = data.current;
      }
    }
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
    this.current_exposure = [];
    this.details.runners.forEach(element => {
      this.current_exposure.push("0.00");
    });
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
    this.current_exposure = [];
    this.fancyMatch.forEach(element => {
      this.current_exposure.push("0.00");
    });
  }

  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }

  showLader(SelectionId, index) {
    this.ds.openBets$.subscribe(data => {
      if (data) {
        let previousBetFancy = [];
        data.forEach(item => {
          if (item.bet_status == 0 && item.market_id == SelectionId) {
            previousBetFancy.push(item);
          }
        });
        let tempPrevioutBet = [];
        tempPrevioutBet = [...previousBetFancy];
        tempPrevioutBet.sort(this.GetSortOrder("placed_odd"));
        this.ladderContent = (this.details.index === index || this.details.index === undefined) ? !this.ladderContent : this.details.index != index ? true : this.ladderContent;
        this.details.index = index;
        this.openBetPlaceDialogForFancy = false;
        if (this.ladderContent) {
          this.ladderTable = [];
          if (tempPrevioutBet.length > 0) {
            console.log(tempPrevioutBet)
            let ladderTable: any = [];
            for (let i = 0; i < tempPrevioutBet.length; i++) {
              if (i == 0) {
                ladderTable.push({ from: 0, to: tempPrevioutBet[i].placed_odd - 1 })
              } else {
                  if (tempPrevioutBet[i - 1].placed_odd != tempPrevioutBet[i].placed_odd) {
                    ladderTable.push({ from: tempPrevioutBet[i - 1].placed_odd, to: tempPrevioutBet[i].placed_odd - 1 })
                  }
              }
            }
            if (tempPrevioutBet.length == 1) {
              ladderTable.push({ from: '', to: tempPrevioutBet[tempPrevioutBet.length - 1].placed_odd });
            } else {
              if (tempPrevioutBet[tempPrevioutBet.length - 2].placed_odd == tempPrevioutBet[tempPrevioutBet.length - 1].placed_odd) {
                ladderTable.push({ from: '', to: tempPrevioutBet[tempPrevioutBet.length - 1].placed_odd });
              } else {
                ladderTable.push({ from: tempPrevioutBet[tempPrevioutBet.length - 2].placed_odd, to: tempPrevioutBet[tempPrevioutBet.length - 1].placed_odd });
              }
            }

            for (let i = 0; i < tempPrevioutBet.length; i++) {
              for (let j = 0; j < ladderTable.length; j++) {
                if (tempPrevioutBet[i].odd == 0) {
                  if (ladderTable[j].to >= tempPrevioutBet[i].placed_odd) {
                    ladderTable[j][i] = tempPrevioutBet[i].price / 100 * tempPrevioutBet[i].stake;
                  }
                  else {
                    ladderTable[j][i] = -Math.abs(tempPrevioutBet[i].stake);
                  }
                }
                else {
                  if (ladderTable[j].to < tempPrevioutBet[i].placed_odd) {
                    ladderTable[j][i] = tempPrevioutBet[i].stake;
                  }
                  else {
                    ladderTable[j][i] = -Math.abs(tempPrevioutBet[i].price / 100 * tempPrevioutBet[i].stake);
                  }
                }
              }
            }
            console.log(ladderTable)
            let all_amount: any = [];
            for (let i = 0; i < ladderTable.length; i++) {
              for (let j = 0; j < tempPrevioutBet.length; j++) {
                if (j == 0) {
                  ladderTable[i]["result"] = ladderTable[i][j];
                } else {
                  ladderTable[i]["result"] += ladderTable[i][j];
                  all_amount[i] = ladderTable[i]["result"];
                }
              }
            }
            this.ladderTable = [...ladderTable];
            console.log(ladderTable)
          }
        }
      }
    });
  }

}
