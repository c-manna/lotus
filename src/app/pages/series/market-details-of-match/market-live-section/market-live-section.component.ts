import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-market-live-section',
  templateUrl: './market-live-section.component.html',
  styleUrls: ['./market-live-section.component.scss']
})
export class MarketLiveSectionComponent implements OnInit {
  @Input() matchesDetails: any;
  @Input() matchOdds: any;
  @Input('fancyMatch') fancyMatch: any;
  createBetFormActive: any;
  selectedItem: any;
  details:any={};
  openBetPlaceDialog=false;
  constructor() { }

  ngOnInit(): void {
    //console.log("matchOdds==", this.matchOdds, "matchesDetails==", this.matchesDetails);
  }

  canceBet() {
    this.openBetPlaceDialog=false;
    //console.log("canceBet");
    this.createBetFormActive = 0;
    // this.viewMode = '';
  }

  openCreateBetForm(viewMode, value, type, item,runnerName,index) {
    console.log(this.matchesDetails)
    this.details.marketId=this.matchesDetails[0].marketId;
    this.details.market_start_time = this.matchesDetails[0].marketStartTime;
    this.details.market_type= this.matchesDetails[0].marketName;
    this.details.runnerName=runnerName;
    this.details.index = index;
    let currentTime = Date.now();
    this.selectedItem = { type: type, ...item, value: value };
    item['viewMode'] = viewMode;
    item['createBetFormActive'] = currentTime;
    this.createBetFormActive = currentTime;
  }

}
