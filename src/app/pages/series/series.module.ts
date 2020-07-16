import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { SeriesComponent } from './series.component';
import { MatchesComponent } from './matches/matches.component';
import { MarketDetailsOfMatchComponent } from './market-details-of-match/market-details-of-match.component';


@NgModule({
  declarations: [SeriesComponent, MatchesComponent, MarketDetailsOfMatchComponent],
  imports: [
    CommonModule,
    SeriesRoutingModule
  ]
})
export class SeriesModule { }
