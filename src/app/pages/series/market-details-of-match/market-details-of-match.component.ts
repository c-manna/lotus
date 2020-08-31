import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { SnakebarService, LoadingService, APIService, DataService } from '@shared/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-market-details-of-match',
  templateUrl: './market-details-of-match.component.html',
  styleUrls: ['./market-details-of-match.component.scss']
})
export class MarketDetailsOfMatchComponent implements OnInit {
  viewMode = 'tab3';
  matchesDetails: any = [];
  eventId;
  marketId: any;
  competitionId;
  matchId: any;
  menuHeader = [];
  matchOdds: any = [];
  getOddsInterval: any;
  fancyMatch: any = [];
  bookMakerMatch: any = [];
  getFancyInterval: any;
  getBookMakerInterval: any;
  openBetList: any = [];
  private subscriptions: Subscription[] = [];
  maxBetMaxMarket: any = [];

  constructor(
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private ds: DataService,
    public platform: Platform,
    private apiService: APIService,
    private router: Router,
    private route: ActivatedRoute) {
    this.getMaxbetMaxMarket(this.route.snapshot.params['id']);
    this.eventId = this.route.snapshot.params['id']
    this.competitionId = this.route.snapshot.params['competitionId']
    this.matchId = this.route.snapshot.params['matchId']
    /* route.params.subscribe((params) => {
      this.eventId = params['id'];
      this.competitionId = params['competitionId'];
      this.matchId = params["matchId"]; });*/
    this.getMatchDetails();
    this.getFancy();
    this.getFancyFromInterval();
  }

  ngOnInit(): void {
    this.getHeaderData();
  }

  getMaxbetMaxMarket(event_id) {
    let param: any = {};
    param.event_id = parseInt(event_id);
    this.apiService.ApiCall(param, environment.apiUrl + 'getMaxBetMaxMarket', 'post').subscribe(
      result => {
        console.log(result);
        this.maxBetMaxMarket['Match Odds'] = result.result.find(obj => obj.market == 'match odds') == undefined ? { status: false } : result.result.find(obj => obj.market == 'match odds');
        this.maxBetMaxMarket['fancy'] = result.result.find(obj => obj.market == 'fancy') == undefined ? { status: false } : result.result.find(obj => obj.market == 'fancy');
        this.maxBetMaxMarket['bookmaker'] = result.result.find(obj => obj.market == 'bookmaker') == undefined ? { status: false } : result.result.find(obj => obj.market == 'bookmaker');
        console.log(this.maxBetMaxMarket)
      }, err => { }
    );
  }

  getHeaderData() {
    this.subscriptions.push(this.ds.breadCrumb$.subscribe(menuHeader => {
      this.menuHeader = menuHeader;
      //console.log(this.menuHeader)
    }));
  }

  getMatchDetails() {
    this._loadingService.show();
    this.subscriptions.push(this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-match?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&matcheventID=' + this.matchId, 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.matchesDetails = result.data;
          this.marketId = result.data[0].marketId;
          for(let i=0;i<result.data.length;i++){
            this.getMatchOdds(i,result.data[i].marketId);
          }
          this.ds.changeMatchOdds(this.matchOdds);
          this.getOddsFromInterval(result);
          this.getBookMaker(result.data[0].marketId);
          this.getBooMakerFromInterval(result.data[0].marketId);
          this.getOpenBets(result.data[0].marketId);
        }
      }, err => { }
    ));
  }

  getFancy() {
    this.subscriptions.push(this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-books?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&matchID=' + this.matchId, 'get').subscribe(
      result => {
        this.fancyMatch = result['data'];
      },
      err => {
      }
    ));
  }


  getMatchOdds(index,marketID) {
    this.subscriptions.push(this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-odds?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&marketID=' + marketID, 'get').subscribe(
      result => {
        if (result.success) {
          this.matchOdds[index] = result["data"][0];
        }
      },
      err => {
      }
    ));
  }

  getBookMaker(market_id) {
    this.subscriptions.push(this.apiService.ApiCall('', environment.apiUrl + 'get-bookmaker/' + market_id, 'get').subscribe(
      result => {
        if (result.success) {
          this.bookMakerMatch = result.data[0];
          this.ds.changeBookMaker(result.data[0]);
          //console.log(this.bookMakerMatch)
        }
      }, err => {
      }));
  }

  getOpenBets(marketID) {
    this.subscriptions.push(this.apiService.ApiCall({}, environment.apiUrl + 'open-bet' + '?market_id=' + marketID, 'get').subscribe(
      result => {
        if (result.success) {
          this.openBetList = result['data'];
        }
      }, err => { }
    ));
  }

  getOddsFromInterval(result) {
    this.getOddsInterval = setInterval(() => {
      for(let i=0;i<result.data.length;i++){
        this.getMatchOdds(i,result.data[i].marketId);
      }
      this.ds.changeMatchOdds(this.matchOdds);
    }, 1000);
  }

  getBooMakerFromInterval(marketID) {
    this.getBookMakerInterval = setInterval(() => {
      this.getBookMaker(marketID);
    }, 1000);
  }

  getFancyFromInterval() {
    this.getFancyInterval = setInterval(() => {
      this.getFancy()
    }, 1000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    clearInterval(this.getOddsInterval);
    clearInterval(this.getFancyInterval);
  }

}
