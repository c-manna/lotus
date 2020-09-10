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
  @Input('matchesDetails') matchesDetails: any = [];
  openBetList: any = [];
  matchBet: any = [];
  unmatchBet: any = [];
  loading: boolean = true;
  constructor(
    private commonService: CommonService,
    private ds: DataService,
    private _router: Router
  ) {
    this.commonService.getOpenBets();
  }

  ngOnInit(): void {
    this.getOpenBets();
  }

  getOpenBets() {
    this.ds.openBets$.subscribe(data => {
      if (data) {
        this.matchBet = [];
        this.unmatchBet = [];
        if (this.matchesDetails.length) {
          if (this.matchesDetails != 0) {
            this.matchesDetails.forEach(item => {
              data.forEach(subItem => {
                if (subItem.bet_status == 0 && subItem.market_id == item.marketId) {
                  this.matchBet.push(subItem);
                } else if (subItem.bet_status == 1 && subItem.market_id == item.marketId) {
                  this.unmatchBet.push(subItem);
                }
              });
            });
          }
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

  goToDetailsPage(betData) {
    this._router.navigate([`/series/${betData.event_id}/matches/${betData.competition_id}/match-details/${betData.match_id}`]);
  }

}
