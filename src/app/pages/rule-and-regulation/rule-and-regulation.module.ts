import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleAndRegulationRoutingModule } from './rule-and-regulation-routing.module';
import { RuleAndRegulationComponent } from './rule-and-regulation.component';


@NgModule({
  declarations: [RuleAndRegulationComponent],
  imports: [
    CommonModule,
    RuleAndRegulationRoutingModule
  ]
})
export class RuleAndRegulationModule { }
