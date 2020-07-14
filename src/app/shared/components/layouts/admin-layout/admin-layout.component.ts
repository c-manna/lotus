import { Component, OnInit, AfterViewInit, ViewChild, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  ResolveStart,
  ResolveEnd
} from '@angular/router';
import { Subscription } from "rxjs";
import { filter } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { SideNavService } from '@shared/services';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.template.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent implements OnInit {
  @ViewChild('drawer') public drawer: MatDrawer;
  @ViewChild('drawer1') public drawer1: MatDrawer;


  constructor(private toolbarService: SideNavService) {

  }

  ngOnInit() {
    // this.toolbarService.setDrawer(this.drawer);
  }
  ngAfterViewInit() {
    this.toolbarService.setDrawer(this.drawer);
    this.toolbarService.setDrawer1(this.drawer1);
  }





}