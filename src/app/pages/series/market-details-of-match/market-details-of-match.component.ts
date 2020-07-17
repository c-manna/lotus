import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { APIService, DataService } from '@shared/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-market-details-of-match',
  templateUrl: './market-details-of-match.component.html',
  styleUrls: ['./market-details-of-match.component.scss']
})
export class MarketDetailsOfMatchComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @HostListener('window:resize', ['$event'])
  viewMode = 'tab3';
  liveMatch = "tab1"
  public innerWidth: any;

  matchesDetails = [];
  _routeListener: Subscription;
  eventId;
  competitionId;
  menuHeader = [];

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
    this.innerWidth = window.innerWidth;
    this.getHeaderData();
  }

  getHeaderData() {
    this.ds.breadCrumb$.subscribe(menuHeader => {
      this.menuHeader = menuHeader;
    });
  }

  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  getMatchDetails(id) {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-match?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&matcheventID=' + id, 'get').subscribe(
      result => {
        if (result.success) {
          this.matchesDetails = result.data;
          this.getMatchOdds(result.data[0].marketId);
          this.getFancy(result.data[0].marketId);
        }
      },
      err => {
      }
    );
  }

  getMatchOdds(marketID) {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-runner?eventID' + this.eventId + '&competitionId=' + this.competitionId + '&marketID=' + marketID, 'get').subscribe(
      result => {

      },
      err => {
      }
    );
  }

  getFancy(marketID) {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-odds?eventID' + this.eventId + '&competitionId=' + this.competitionId + '&matcheventID=' + marketID, 'get').subscribe(
      result => {
        
      },
      err => {
      }
    );
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }

}
