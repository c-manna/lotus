import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-market-tab',
  templateUrl: './market-tab.component.html',
  styleUrls: ['./market-tab.component.scss']
})
export class MarketTabComponent implements OnInit {
  @Input() matchOdds: any;
  @Input() matchesDetails: any;
  @Input('fancyMatch') fancyMatch: any;
  @Input('bookMakerMatch') bookMakerMatch: any;
  @Input()maxBetMaxMarket:any=[];
  
  constructor() { }

  ngOnInit(): void {
    console.log("matchOdds==", this.matchOdds, this.matchesDetails, this.bookMakerMatch);
  }

}
