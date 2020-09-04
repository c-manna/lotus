import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { APIService, SnakebarService, LoadingService, DataService } from '@shared/services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  series = [];
  eventId;
  counter = 0;
  eventData: any;
  panelOpenState: boolean = false;
  inplayData: any = [];

  constructor(
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private ds: DataService,
    private apiService: APIService,
    private router: Router,
    private route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.eventId = params["id"];
      this.getSeries();
    })
  }

  ngOnInit(): void {
    this.ds.event$.subscribe(event => {
      this.eventData = event;
    });
    this.inPlayMatches(this.eventId);
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState
  }

  setHeaderData(data) {
    this.ds.changeBread(data);
  }

  getSeries() {
    this._loadingService.show();
    this.apiService.ApiCall('', environment.apiUrl + 'event-competition?eventID=' + this.eventId, 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.series = result.data;
        } else {
          this.series = [];
        }
      },
      err => {
        this._loadingService.hide();
      }
    );
  }

  inPlayMatches(eventId) {
    let param = {};
    this.apiService.ApiCall(param, environment.apiUrl + 'inplay-match/?eventID=' + eventId, 'get').subscribe(
      result => {
        if (result.success) {
          this.inplayData = result["data"]["inplay_data"];
        }
      },
      err => {
      }
    );
  }

  ngOnDestroy() {
  }
}