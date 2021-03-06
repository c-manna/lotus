import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeriesComponent } from './series.component';
import { MatchesComponent } from './matches/matches.component';
import { MarketDetailsOfMatchComponent } from './market-details-of-match/market-details-of-match.component';

const routes: Routes = [
  { path: '', component: SeriesComponent },
  { path: 'matches/:competitionId', component: MatchesComponent },
  { path: 'matches/:competitionId/match-details/:matchId', component: MarketDetailsOfMatchComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }
