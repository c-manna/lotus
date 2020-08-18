import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { SnakebarService, LoadingService, APIService, DataService } from '@shared/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {
  matches: any = [];
  eventId;
  competitionId;
  menuHeader: any;
  constructor(
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private ds: DataService,
    private apiService: APIService,
    private router: Router,
    private route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.eventId = params['id'];
      this.competitionId = params['competitionId'];
      this.getMatches();
    })
  }

  ngOnInit(): void {
    this.ds.breadCrumb$.subscribe(menuHeader => {
      this.menuHeader = menuHeader;
    });
  }

  setEventName(data) {
    this.ds.changeEventDetails(data);
  }

  getMatches() {
    this._loadingService.show();
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-match-series?eventID=' + this.eventId + '&competitionId=' + this.competitionId, 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.matches = result.data;
        }
        else {
        }
      },
      err => {
      }
    );
  }

  ngOnDestroy() {
  }

}
