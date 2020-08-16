import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingService, SnakebarService } from '@app/shared/services/common.service';
import { APIService } from '@app/shared/services/api.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-market-type-details',
  templateUrl: './market-type-details.component.html',
  styleUrls: ['./market-type-details.component.scss']
})
export class MarketTypeDetailsComponent implements OnInit {
  marketType: any;
  loading: boolean = true;
  marketData: any = [];
  headingData: any = {};
  commission: any = 0;
  calculatedData: any = { backSubtotal: 0, laySubtotal: 0, marketSubtotal: 0, commision: 0, netMarket: 0 };
  constructor(
    private _route: ActivatedRoute,
    private _apiService: APIService,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe((route) => {
      this.marketType = route["marketType"];
      this.getPunterCommision();
    });
  }

  getPunterCommision() {
    this._loadingService.show();
    this._apiService.ApiCall({}, environment.apiUrl + 'user-details', 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.commission = result['data'].punter_commission;
          // console.log(this.commission)
          this.getBettingData();
        }
      }, err => {
        this._loadingService.hide();
      });
  }

  getBettingData() {
    if (this.loading) this._loadingService.show();
    this._apiService.ApiCall({}, environment.apiUrl + 'profit-loss-details/' + this.marketType, 'get').subscribe(
      result => {
        if (this.loading) this._loadingService.hide();
        if (result.success) {
          this.marketData = result['data'];
          if (this.marketData.length) this.headingData = this.marketData[0];
          this.calculateData();
        }
      }, err => {
        if (this.loading) this._loadingService.hide();
      });
  }

  calculateData() {
    this.marketData.forEach(item => {
      if (item.p_and_l == 0) {
        if (item.odd == 0) this.calculatedData.backSubtotal = this.calculatedData.backSubtotal + item.stake;
        else this.calculatedData.laySubtotal = this.calculatedData.laySubtotal + item.stake;
      } else {
        if (item.odd == 0) this.calculatedData.backSubtotal = this.calculatedData.backSubtotal - item.stake;
        else this.calculatedData.laySubtotal = this.calculatedData.laySubtotal + item.stake;
      }
    });
    this.calculatedData.marketSubtotal = (this.calculatedData.backSubtotal + this.calculatedData.laySubtotal)
    if ((this.calculatedData.marketSubtotal) > 0) {
      let calculatedComission = ((this.calculatedData.marketSubtotal * this.commission) / 100);
      this.calculatedData.commision = calculatedComission;
    }
    this.calculatedData.netMarket = this.calculatedData.marketSubtotal - this.calculatedData.commision;
  }

}
