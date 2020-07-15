import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { APIService } from '@shared/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {
  matches = [];

  constructor(private apiService: APIService,
    private router: Router,
    private route: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.route.snapshot.params['id']) {
          this.getMatches(this.route.snapshot.paramMap.get('id'));
        }
      }
    });
  }

  ngOnInit(): void {
  }

  getMatches(id) {
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-match-series?eventID='+id+'&competitionId=' + id, 'get').subscribe(
      result => {
        if (result.success) {
          this.matches = result.data;
        }
      },
      err => {
      }
    );
  }

}
