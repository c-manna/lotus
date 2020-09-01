import { Component, OnInit, Input } from '@angular/core';
import { SnakebarService, LoadingService } from '@app/shared/services/common.service';
import { environment } from '@env/environment';
import { APIService, DataService, CommonService } from '@app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-open-bets',
  templateUrl: './open-bets.component.html',
  styleUrls: ['./open-bets.component.scss']
})
export class OpenBetsComponent implements OnInit {
  @Input('marketId') marketId: any;
  openBetList: any = [];
  matchBet: any = [];
  unmatchBet: any = [];
  events = [{ "eventType": "1", "name": "Soccer", "marketCount": 2492 }, { "eventType": "2", "name": "Tennis", "marketCount": 5578 }, { "eventType": "4", "name": "Cricket", "marketCount": 22 }, { "eventType": "7", "name": "Horse Racing", "marketCount": 831 }, { "eventType": "4339", "name": "Greyhound Racing", "marketCount": 298 }];
  loading: boolean = true;
  constructor(
    private commonService: CommonService,
    private ds: DataService,
    private apiService: APIService,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private _router: Router
  ) {
    this.commonService.getOpenBets();
  }

  ngOnInit(): void {
    this.getOpenBets();
    this.getEvents();
  }

  getOpenBets() {
    this.ds.openBets$.subscribe(data => {
      if (data) {
        this.matchBet = [];
        this.unmatchBet = [];
        if (this.marketId != undefined) {
          data.forEach(item => {
            if (item.bet_status == 0 && item.market_id == this.marketId) {
              this.matchBet.push(item);
            } else if (item.bet_status == 1 && item.market_id == this.marketId) {
              this.unmatchBet.push(item);
            }
          });
        } else {
          data.forEach(item => {
            if (item.bet_status == 0) {
              this.matchBet.push(item);
            } else {
              this.unmatchBet.push(item);
            }
          });
        }
      }
    });
  }

  ngOnDestroy() {
  }

  getEvents() {
    this.apiService.ApiCall('', environment.apiUrl + 'event', 'get').subscribe(result => {
      if (result.success) {
        this.events = result.data;
      }
    }, err => {

    });
  }

  goToDetailsPage(betData) {
    let event = this.events.find(item => item.name === betData.event_name);
    // if (event) { //matches/:competitionId/match-details/:matchId
    //   this._router.navigate([`/series/${event.eventType}/matches/${betData.competition_id}/match-details/${betData.match_id}`]);
    // }
  }

}
