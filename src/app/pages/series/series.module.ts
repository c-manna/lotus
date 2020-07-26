import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { SeriesComponent } from './series.component';
import { MatchesComponent } from './matches/matches.component';
import { MarketDetailsOfMatchComponent } from './market-details-of-match/market-details-of-match.component';
import { MarketTabComponent } from './market-details-of-match/market-tab/market-tab.component';
import { NewsTabComponent } from './market-details-of-match/news-tab/news-tab.component';
import { LiveTabComponent } from './market-details-of-match/live-tab/live-tab.component';
import { MarketLiveSectionComponent } from './market-details-of-match/market-live-section/market-live-section.component';
import { SharedModule } from '@shared/shared.module';
import { OpenBetsModule } from '@app/pages/open-bets/open-bets.module';

@NgModule({
  declarations: [SeriesComponent, MatchesComponent, MarketDetailsOfMatchComponent, MarketTabComponent, NewsTabComponent, LiveTabComponent, MarketLiveSectionComponent],
  imports: [
    CommonModule,
    SeriesRoutingModule,
    SharedModule,
    OpenBetsModule
  ]
})
export class SeriesModule { }
