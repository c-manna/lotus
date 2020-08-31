import { Component, OnInit, Input } from '@angular/core';
import { SnakebarService, LoadingService } from '@app/shared/services/common.service';
import { environment } from '@env/environment';
import { APIService } from '@app/shared/services/api.service';
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
  openBetInterval: any;
  events = [{ "eventType": "1", "name": "Soccer", "marketCount": 2492 }, { "eventType": "2", "name": "Tennis", "marketCount": 5578 }, { "eventType": "4", "name": "Cricket", "marketCount": 22 }, { "eventType": "7", "name": "Horse Racing", "marketCount": 831 }, { "eventType": "4339", "name": "Greyhound Racing", "marketCount": 298 }];
  loading: boolean = true;
  constructor(
    private apiService: APIService,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.getOpenBets();
    this.getOpenBetFromInterval();
    this.getEvents();
  }

  getOpenBets() {
    if (this.loading) this._loadingService.show();
    this.apiService.ApiCall({}, environment.apiUrl + 'open-bet' + ((this.marketId) ? '?market_id=' + this.marketId : ''), 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.openBetList = result['data'];
          this.matchBet = [];
          this.unmatchBet = [];
          this.openBetList.forEach(item => {
            if (item.bet_status == 0) {
              this.matchBet.push(item);
            } else {
              this.unmatchBet.push(item);
            }
          });
          console.log(this.matchBet)
        }
      },
      err => {
        this._loadingService.hide();
      }
    );
  }

  getOpenBetFromInterval() {
    this.openBetInterval = setInterval(() => {
      this.loading = false;
      this.getOpenBets()
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.openBetInterval);
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
