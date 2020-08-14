import { Component, OnInit } from '@angular/core';
import { SnakebarService, LoadingService } from '@app/shared/services/common.service';
import { environment } from '@env/environment';
import { APIService } from '@app/shared/services/api.service';

@Component({
  selector: 'app-open-bets',
  templateUrl: './open-bets.component.html',
  styleUrls: ['./open-bets.component.scss']
})
export class OpenBetsComponent implements OnInit {
  openBetList: any = [];
  matchBet: any = [];
  unmatchBet: any = [];
  openBetInterval: any;
  loading: boolean = true;
  constructor(
    private apiService: APIService,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService
  ) { }

  ngOnInit(): void {
    this.getOpenBets();
    this.getOpenBetFromInterval();
  }

  getOpenBets() {
    if (this.loading) this._loadingService.show();
    this.apiService.ApiCall({}, environment.apiUrl + 'open-bet', 'get').subscribe(
      result => {
        if (this.loading) this._loadingService.hide();
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
        }
      },
      err => {
        if (this.loading) this._loadingService.hide();
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

}
