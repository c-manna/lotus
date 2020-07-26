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
  matchesDetails = [{
    "marketId": "1.166397338", "marketName": "Match Odds", "marketStartTime": "2019-12-19T04:45:00.000Z", "totalMatched": 35685.4, "runners":
      [{ "selectionId": 7461, "runnerName": "Pakistan", "handicap": 0, "sortPriority": 1 },
      { "selectionId": 7337, "runnerName": "Sri Lanka", "handicap": 0, "sortPriority": 2 },
      { "selectionId": 60443, "runnerName": "The Draw", "handicap": 0, "sortPriority": 3 }]
  }];
  _routeListener: Subscription;
  eventId;
  competitionId;
  menuHeader = [];
  //matchOdds: any = [];
  getOddsInterval: any;

  matchOdds: any =
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

  fancyMatch = [{
    "RunnerName": "CC 20 Over Runs ADV", "LayPrice1": 172, "LaySize1": 100, "BackPrice1": 175, "BackSize1": 100, "GameStatus": "", "SelectionId": "94476"
  }, {
    "RunnerName": "Highest Run In Over ADV", "LayPrice1": 20, "LaySize1": 100, "BackPrice1": 21, "BackSize1": 100, "GameStatus": "", "SelectionId": "94490"
  }, {
    "RunnerName": "sd", "LayPrice1": 0, "LaySize1": 0, "BackPrice1": 0, "BackSize1": 0, "GameStatus": "OFFLINE", "SelectionId": "94481"
  }, {
    "RunnerName": "CW 6 Over Runs ADV", "LayPrice1": 48, "LaySize1": 100, "BackPrice1": 50, "BackSize1": 100, "GameStatus": "", "SelectionId": "94477"
  }, {
    "RunnerName": "NUSE", "LayPrice1": 0, "LaySize1": 0, "BackPrice1": 0, "BackSize1": 0, "GameStatus": "OFFLINE", "SelectionId": "94271"
  }, {
    "RunnerName": "B Rajapaksa Runs Open Valid", "LayPrice1": 23, "LaySize1": 110, "BackPrice1": 23, "BackSize1": 90, "GameStatus": "", "SelectionId": "94483"
  }, {
    "RunnerName": "Total Match Wkt ADV", "LayPrice1": 12, "LaySize1": 100, "BackPrice1": 13, "BackSize1": 100, "GameStatus": "", "SelectionId": "94487"
  }, {
    "RunnerName": "L Simmons Runs Open Valid", "LayPrice1": 25, "LaySize1": 110, "BackPrice1": 25, "BackSize1": 90, "GameStatus": "", "SelectionId": "95480"
  }, {
    "RunnerName": "Total Match Wide ADV", "LayPrice1": 8, "LaySize1": 100, "BackPrice1": 9, "BackSize1": 100, "GameStatus": "", "SelectionId": "94488"
  }, {
    "RunnerName": "Fall Of 1st WKT CWADV", "LayPrice1": 24, "LaySize1": 110, "BackPrice1": 24, "BackSize1": 90, "GameStatus": "", "SelectionId": "94480"
  }, {
    "RunnerName": "S Sarkar Runs Open Valid", "LayPrice1": 22, "LaySize1": 110, "BackPrice1": 22, "BackSize1": 90, "GameStatus": "", "SelectionId": "95481"
  }, {
    "RunnerName": "A Fernando Runs Open Valid", "LayPrice1": 22, "LaySize1": 110, "BackPrice1": 22, "BackSize1": 90, "GameStatus": "", "SelectionId": "94482"
  }, {
    "RunnerName": "Total Match Sixes ADV", "LayPrice1": 14, "LaySize1": 100, "BackPrice1": 16, "BackSize1": 100, "GameStatus": "", "SelectionId": "94486"
  }, {
    "RunnerName": "deg", "LayPrice1": 0, "LaySize1": 0, "BackPrice1": 0, "BackSize1": 0, "GameStatus": "OFFLINE", "SelectionId": "94484"
  }, {
    "RunnerName": "CC Will Win The Toss Bhav", "LayPrice1": 1, "LaySize1": 110, "BackPrice1": 1, "BackSize1": 90, "GameStatus": "", "SelectionId": "94472"
  }, {
    "RunnerName": "Total Match Four ADV", "LayPrice1": 26, "LaySize1": 100, "BackPrice1": 28, "BackSize1": 100, "GameStatus": "", "SelectionId": "94485"
  }, {
    "RunnerName": "Fall Of 1st WKT CC ADV", "LayPrice1": 25, "LaySize1": 110, "BackPrice1": 25, "BackSize1": 90, "GameStatus": "", "SelectionId": "94479"
  }, {
    "RunnerName": "NO USE", "LayPrice1": 0, "LaySize1": 0, "BackPrice1": 0, "BackSize1": 0, "GameStatus": "OFFLINE", "SelectionId": "94272"
  }, {
    "RunnerName": "CW 20 Over Runs ADV", "LayPrice1": 170, "LaySize1": 100, "BackPrice1": 173, "BackSize1": 100, "GameStatus": "", "SelectionId": "94478"
  }, {
    "RunnerName": "Match 1st Over Runs ADV", "LayPrice1": 6, "LaySize1": 100, "BackPrice1": 7, "BackSize1": 100, "GameStatus": "", "SelectionId": "94473"
  }, {
    "RunnerName": "CC 6 Over Runs ADV", "LayPrice1": 48, "LaySize1": 100, "BackPrice1": 50, "BackSize1": 100, "GameStatus": "", "SelectionId": "94475"
  }, {
    "RunnerName": "Match Only 2nd Over Runs ADV", "LayPrice1": 7, "LaySize1": 100, "BackPrice1": 8, "BackSize1": 100, "GameStatus": "", "SelectionId": "94474"
  }, {
    "RunnerName": "Top Scoring Batsman Runs ADV", "LayPrice1": 64, "LaySize1": 100, "BackPrice1": 67, "BackSize1": 100, "GameStatus": "", "SelectionId": "94491"
  }, {
    "RunnerName": "Total Match Extra Runs ADV", "LayPrice1": 14, "LaySize1": 100, "BackPrice1": 16, "BackSize1": 100, "GameStatus": "", "SelectionId": "94489"
  }];

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
          this.getFancy(id);
          this.getMatchOdds(result.data[0].marketId);
          this.getOddsFromInterval(result.data[0].marketId);
        }
      },
      err => {
      }
    );
  }

  getFancy(matchID) {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-books?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&matchID==' + matchID, 'get').subscribe(
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
