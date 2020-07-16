import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { environment } from '@env/environment';
import { APIService } from '@shared/services';
import { Router } from '@angular/router';
import { SideNavService } from '@shared/services';

@Component({
  selector: 'app-admin-left-panel',
  templateUrl: './admin-left-panel.component.html',
  styleUrls: ['./admin-left-panel.component.scss'],
})
export class AdminLeftPanelComponent implements OnInit {
  events = [];

  constructor(
    private apiService: APIService,
    private router: Router,
    private toolbarService: SideNavService) {
    this.router.events.subscribe(event => {
    });
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents(){
    this.apiService.ApiCall('', environment.apiUrl + 'event', 'get').subscribe(
      result => {
        if(result.success){
          this.events = result.data;
        }       
      },
      err => {
      }
    );
  }

  closeNav(){
    this.toolbarService.close();
  }

}
