import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { APIService } from '@shared/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SideNavService } from '@shared/services';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  series = [];

  constructor(private apiService: APIService,
    private router: Router,
    private toolbarService: SideNavService,
    private route: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.route.snapshot.params['id']) {
          this.getSeries(this.route.snapshot.paramMap.get('id'));
        }
      }
    });
  }

  ngOnInit(): void {

  }

  getSeries(id) {
    this.apiService.ApiCall('', environment.apiUrl + 'event-competition?eventID=' + id, 'get').subscribe(
      result => {
        if (result.success) {
          this.series = result.data;
          console.log(this.series)
        }
      },
      err => {
      }
    );
  }

}
