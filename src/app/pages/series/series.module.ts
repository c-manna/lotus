import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { SeriesComponent } from './series.component';
import { MatchesComponent } from './matches/matches.component';


@NgModule({
  declarations: [SeriesComponent, MatchesComponent],
  imports: [
    CommonModule,
    SeriesRoutingModule
  ]
})
export class SeriesModule { }
