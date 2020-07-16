import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { APIService } from '@shared/services';
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
  competitionId
  constructor(
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
  }

  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  getMatchDetails(id) {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-market-match?eventID=' + this.eventId + '&competitionId=' + this.competitionId + '&matcheventID=' + id, 'get').subscribe(
      result => {
        if (result.success) {
          this.matchesDetails = result.data;
        }
      },
      err => {
      }
    );
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }

}
