import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { SeriesComponent } from './series.component';
import { MatchesComponent } from './matches/matches.component';
import { MarketDetailsOfMatchComponent } from './market-details-of-match/market-details-of-match.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MarketTabComponent } from './market-details-of-match/market-tab/market-tab.component';
import { NewsTabComponent } from './market-details-of-match/news-tab/news-tab.component';
import { LiveTabComponent } from './market-details-of-match/live-tab/live-tab.component';
import { OpenBetsTabComponent } from './market-details-of-match/open-bets-tab/open-bets-tab.component';
import { MarketLiveSectionComponent } from './market-details-of-match/market-live-section/market-live-section.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [SeriesComponent, MatchesComponent, MarketDetailsOfMatchComponent, MarketTabComponent, NewsTabComponent, LiveTabComponent, OpenBetsTabComponent, MarketLiveSectionComponent],
  imports: [
    CommonModule,
    SeriesRoutingModule,
    MatExpansionModule,
    SharedModule
  ]
})
export class SeriesModule { }
