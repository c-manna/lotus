import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BettingProfitAndLossComponent } from './betting-profit-and-loss.component';
import { MarketTypeDetailsComponent } from './market-type-details/market-type-details.component';

const routes: Routes = [
  { path: '', component: BettingProfitAndLossComponent },
  { path: ':marketType', component: MarketTypeDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BettingProfitAndLossRoutingModule { }
