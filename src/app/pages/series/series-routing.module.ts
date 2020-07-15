import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeriesComponent } from './series.component';
import { MatchesComponent } from './matches/matches.component';

const routes: Routes = [
  { path: '', component: SeriesComponent },
  { path: 'matches/:id', component: MatchesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }
