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

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.template.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent implements OnInit {

  ngOnInit(){}

  constructor(){
    
  }
  
}