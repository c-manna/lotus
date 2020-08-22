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
  competitionId;
  matchId: any;
  menuHeader = [];
  matchOdds: any = [];
  getOddsInterval: any;
  fancyMatch: any = [];
  bookMakerMatch: any = [];
  getFancyInterval: any;

  constructor(
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private ds: DataService,
    public platform: Platform,
    private apiService: APIService,
    private router: Router,
    private route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.eventId = params['id'];
      this.competitionId = params['competitionId'];
      this.matchId = params["matchId"];
      this.getMatchDetails();
      this.getFancy();
      //this.getFancyFromInterval();
    });
  }

  ngOnInit(): void {
    this.getHeaderData();
    this.getBookMaker();
    console.log(this.matchOdds)
  }

  getHeaderData() {
    this.ds.breadCrumb$.subscribe(menuHeader => {
      this.menuHeader = menuHeader;
      console.log(this.menuHeader)
    });
  }

  getMatchDetails() {
    this._loadingService.show();
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-match?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&matcheventID=' + this.matchId, 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.matchesDetails = result.data;
          this.getMatchOdds(result.data[0].marketId);
          //this.getOddsFromInterval(result.data[0].marketId);
        }
      }, err => {
      }
    );
  }

  getFancy() {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-books?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&matchID=' + this.matchId, 'get').subscribe(
      result => {
        this.fancyMatch = result['data'];
      },
      err => {
      }
    );
  }


  getMatchOdds(marketID) {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-odds?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&marketID=' + marketID, 'get').subscribe(
      result => {
        if (result.success) {
          this.matchOdds = result["data"];
          this.ds.changeMatchOdds(result["data"]);
        }
      },
      err => {
      }
    );
  }

  getBookMaker() {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-books?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&matchID=' + this.matchId, 'get').subscribe(
      result => {
        if (result.success) {
          console.log("got result");
          this.bookMakerMatch = result["data"];
          this.ds.changeBookMaker(result["data"]);
        }
      }, err => {
      });
  }

  getOddsFromInterval(marketID) {
    this.getOddsInterval = setInterval(() => {
      this.getMatchOdds(marketID)
    }, 500);
  }

  getFancyFromInterval() {
    this.getFancyInterval = setInterval(() => {
      this.getFancy()
    }, 500);
  }

  ngOnDestroy() {
    clearInterval(this.getOddsInterval);
    clearInterval(this.getFancyInterval);
  }

}
