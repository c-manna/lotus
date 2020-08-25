import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { APIService } from '@app/shared/services/api.service';
import { LoadingService } from '@app/shared/services/common.service';

@Component({
  selector: 'app-my-market-page',
  templateUrl: './my-market-page.component.html',
  styleUrls: ['./my-market-page.component.scss']
})
export class MyMarketPageComponent implements OnInit {
  marketData: any = [];
  loading: boolean = true;
  refreshDataInterval: any;
  constructor(private _apiService: APIService,
    private _loadingService: LoadingService) { }

  ngOnInit(): void {
    this.getMyMarket();
    this.dataFromInterval();
  }

  getMyMarket() {
    if (this.loading) this._loadingService.show();
    this._apiService.ApiCall({}, `${environment.apiUrl}myMarket`, 'get').subscribe(res => {
      if (this.loading) this._loadingService.hide();
      this.loading = false;
      if (res.success) {
        this.marketData = res['data'];
      } else {
      }
    }, err => {
      if (this.loading) this._loadingService.hide();
      this.loading = false;
    });
  }

  dataFromInterval() {
    this.refreshDataInterval = setInterval(() => {
      this.getMyMarket();
    }, 5000);
  }

  showIcon(name) {
    if (name == 'Soccer') return 'assets/icons/football.svg';
    else if (name == 'Cricket') return 'assets/icons/cricket.svg';
    else if (name == 'Tennis') return 'assets/icons/tennis.svg';
    else if (name == 'Horse Racing') return 'assets/icons/horse.svg';
    else if (name == 'Greyhound Racing') return 'assets/icons/greyhound_1.svg';
    else return '';
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshDataInterval);
  }

}
