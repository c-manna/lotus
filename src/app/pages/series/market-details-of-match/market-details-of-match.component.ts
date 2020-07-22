import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { APIService, DataService } from '@shared/services';
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
  matchesDetails = [];
  _routeListener: Subscription;
  eventId;
  competitionId;
  menuHeader = [];
  matchOdds: any = [];
  getOddsInterval: any;

  matchOdds1 =
    [
      {
        "marketId": "1.166536383", "isMarketDataDelayed": false, "status": "OPEN", "betDelay": 0,
        "bspReconciled": false, "complete": true, "inplay": false, "numberOfWinners": 1,
        "numberOfRunners": 3, "numberOfActiveRunners": 3, "lastMatchTime": "2019-12-20T05:23:08.702Z",
        "totalMatched": 4559.69, "totalAvailable": 278781.7, "crossMatching": true, "runnersVoidable": false,
        "version": 3088274180,
        "runners":
          [
            {
              "selectionId": 8838647, "handicap": 0, "status": "ACTIVE", "lastPriceTraded": 6.4, "totalMatched": 66.32,
              "ex":
              {
                "availableToBack":
                  [
                    { "price": 5.8, "size": 33.24 },
                    { "price": 5.3, "size": 101.57 },
                    { "price": 3, "size": 63.86 }
                  ],
                "availableToLay":
                  [
                    { "price": 8.6, "size": 39.91 },
                    { "price": 8.8, "size": 101.57 },
                    { "price": 42, "size": 59.59 }
                  ],
                "tradedVolume": []
              }
            },
            {
              "selectionId": 4525658, "handicap": 0, "status": "ACTIVE", "lastPriceTraded": 1.36, "totalMatched": 4414.45,
              "ex": {
                "availableToBack":
                  [
                    { "price": 1.36, "size": 684.33 }, { "price": 1.35, "size": 98.7 }, { "price": 1.34, "size": 222.31 }
                  ],
                "availableToLay":
                  [{ "price": 1.43, "size": 58.59 }, { "price": 1.53, "size": 50.78 },
                  { "price": 1.57, "size": 419.68 }
                  ],
                "tradedVolume": []
              }
            },
            {
              "selectionId": 58805, "handicap": 0, "status": "ACTIVE", "lastPriceTraded": 5.4,
              "totalMatched": 78.91, "ex": {
                "availableToBack":
                  [{ "price": 4.8, "size": 47.89 }, { "price": 4.5, "size": 117.51 },
                  { "price": 3.1, "size": 51.89 }
                  ],
                "availableToLay":
                  [{ "price": 7, "size": 62.15 }, { "price": 7.2, "size": 101.57 },
                  { "price": 16, "size": 51.46 }
                  ],
                "tradedVolume": []
              }
            }
          ]
      }
    ]

  constructor(
    private ds: DataService,
    public platform: Platform,
    private apiService: APIService,
    private router: Router,
    private route: ActivatedRoute) {
    this._routeListener = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.route.snapshot.params['id']) {
          let url = event.urlAfterRedirects.split('/');
          this.eventId = url[2];
          this.competitionId = url[4];
          this.getMatchDetails(this.route.snapshot.paramMap.get('id'));
        }
      }
    });
  }

  ngOnInit(): void {

    this.getHeaderData();
    console.log(this.matchOdds)
  }

  getHeaderData() {
    this.ds.breadCrumb$.subscribe(menuHeader => {
      this.menuHeader = menuHeader;
    });
  }



  getMatchDetails(id) {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-match?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&matcheventID=' + id, 'get').subscribe(
      result => {
        if (result.success) {
          this.matchesDetails = result.data;
          this.getFancy(result.data[0].marketId);
          this.getMatchOdds(result.data[0].marketId);
          this.getOddsFromInterval(result.data[0].marketId);
        }
      },
      err => {
      }
    );
  }

  getFancy(marketID) {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-runner?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&marketID=' + marketID, 'get').subscribe(
      result => {

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
        }
      },
      err => {
      }
    );
  }

  getOddsFromInterval(marketID) {
    this.getOddsInterval = setInterval(() => {
      this.getMatchOdds(marketID)
    }, 5000);
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
    clearInterval(this.getOddsInterval);
  }

}
