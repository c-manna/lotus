import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { environment } from '@env/environment';
import { APIService, DataService, SideNavService } from '@shared/services';
import { Subscription } from "rxjs";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-rightside-panel',
  templateUrl: './admin-rightside-panel.component.html',
  styleUrls: ['./admin-rightside-panel.component.scss']
})
export class AdminRightsidePanelComponent implements OnInit {

  constructor( private ds: DataService,
    private apiService: APIService,
    private router: Router,
    private toolbarService: SideNavService) { 
  }

  ngOnInit() {

  }

  closeNav(){
    this.toolbarService.close();
  }
  /* Logout Admin user */
  logout() {
  }
}
