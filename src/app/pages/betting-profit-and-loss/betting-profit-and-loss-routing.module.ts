import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BettingProfitAndLossComponent } from './betting-profit-and-loss.component';

const routes: Routes = [{ path: '', component: BettingProfitAndLossComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BettingProfitAndLossRoutingModule { }
