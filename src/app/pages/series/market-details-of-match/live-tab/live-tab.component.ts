import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-live-tab',
  templateUrl: './live-tab.component.html',
  styleUrls: ['./live-tab.component.scss']
})
export class LiveTabComponent implements OnInit {
  // @HostListener('window:resize', ['$event'])
  @Input() matchesDetails: any;
  public innerWidth: any;
  liveMatch = "tab1"
  constructor() { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

}
