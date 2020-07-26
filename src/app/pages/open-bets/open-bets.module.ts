import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenBetsRoutingModule } from './open-bets-routing.module';
import { OpenBetsComponent } from './open-bets.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [OpenBetsComponent],
  imports: [
    CommonModule,
    OpenBetsRoutingModule,
    SharedModule
  ],
  exports: [OpenBetsComponent]
})
export class OpenBetsModule { }
