import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuleAndRegulationComponent } from './rule-and-regulation.component';

const routes: Routes = [{ path: '', component: RuleAndRegulationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleAndRegulationRoutingModule { }
