import { Component, OnInit } from '@angular/core';
import { LoadingService, SnakebarService } from '@app/shared/services/common.service';
import { APIService } from '@app/shared/services/api.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-betting-profit-and-loss',
  templateUrl: './betting-profit-and-loss.component.html',
  styleUrls: ['./betting-profit-and-loss.component.scss']
})
export class BettingProfitAndLossComponent implements OnInit {
  profitLossBet: any = [];
  loading: boolean = true;
  startDate: any;
  endDate: any;
  commission: any = 0;
  inputError: any = {};
  submit: boolean = false;
  constructor(
    private _apiService: APIService,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService
  ) { }

  ngOnInit(): void {
    this.getPunterCommision();
  }

  getPunterCommision() {
    this._loadingService.show();
    this._apiService.ApiCall({}, environment.apiUrl + 'user-details', 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.commission = result['data'].punter_commission;
          console.log(this.commission)
          this.getProfitLossBet('');
        }
      }, err => {
        this._loadingService.hide();
      });
  }

  getProfitLossBet(queryData) {
    if (this.loading) this._loadingService.show();
    this._apiService.ApiCall({}, environment.apiUrl + 'profit-loss-bet' + queryData, 'get').subscribe(
      result => {
        if (this.loading) this._loadingService.hide();
        if (result.success) {
          this.profitLossBet = result['data'];
          this.profitLossBet.forEach(item => {
            let eachArray = item.value;
            let groupByName = {};

            eachArray.forEach(function (a) {
              groupByName[a.market_id] = groupByName[a.market_id] || [];
              groupByName[a.market_id].push(a);
            });
            item.eachBet = groupByName;
            console.log(groupByName);
            console.log(item)
          });
          console.log("ata", this.profitLossBet)
        }
      }, err => {
        if (this.loading) this._loadingService.hide();
      });
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  calculateNetWin(items) {
    // console.log(items);
    let winAmount = 0;
    items.forEach(item => {
      if (item.p_and_l == 0) {
        winAmount = winAmount + item.amount
      } else {
        winAmount = winAmount - item.amount
      }
    });
    if (winAmount > 0) return (winAmount - ((winAmount * this.commission) / 100));
    else return winAmount;
  }

  calculateComission(items) {
    let winAmount = 0;
    items.forEach(item => {
      if (item.p_and_l == 0) {
        winAmount = winAmount + item.amount
      } else {
        winAmount = winAmount - item.amount
      }
    });
    if (winAmount > 0) return ((winAmount * this.commission) / 100);
    else return 0;
  }

  calculateProfitLoss(items) {
    // console.log(items);
    let winAmount = 0;
    items.forEach(item => {
      if (item.p_and_l == 0) {
        winAmount = winAmount + item.amount
      } else {
        winAmount = winAmount - item.amount
      }
    });
    if (winAmount > 0) return (winAmount - ((winAmount * this.commission) / 100));
    else return winAmount;
  }

  startDateChange(e) {
    console.log("startDateChange", e.value)
    this.startDate = new Date(e.value).getTime();
    console.log(this.startDate);
    this.inputError.startDate = false;
  }

  endDateChange(e) {
    console.log("startDateChange", e.value);
    this.endDate = new Date(e.value).getTime();
    console.log(this.endDate);
    this.inputError.endDate = false;
  }

  searchData() {
    this.submit = true;
    if (this.startDate && this.endDate) {
      this.inputError = {};
      let queryData = `?startDate=${this.startDate}&endDate=${this.endDate}`;
      this.submit = false;
      this.getProfitLossBet(queryData);
    } else {
      if (!this.endDate) this.inputError.endDate = true;
      if (!this.startDate) this.inputError.startDate = true;
    }
  }

}
