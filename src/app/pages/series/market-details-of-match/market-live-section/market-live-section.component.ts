import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-market-live-section',
  templateUrl: './market-live-section.component.html',
  styleUrls: ['./market-live-section.component.scss']
})
export class MarketLiveSectionComponent implements OnInit {
  @Input() matchesDetails: any;
  @Input() matchOdds: any;
  constructor() { }

  ngOnInit(): void {
    console.log("matchOdds==", this.matchOdds, "matchesDetails==", this.matchesDetails);
  }

}
