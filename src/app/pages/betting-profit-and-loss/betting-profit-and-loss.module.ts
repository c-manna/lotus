import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BettingProfitAndLossRoutingModule } from './betting-profit-and-loss-routing.module';
import { BettingProfitAndLossComponent } from './betting-profit-and-loss.component';
import { SharedModule } from '@shared/shared.module';
import { MarketTypeDetailsComponent } from './market-type-details/market-type-details.component';

@NgModule({
  declarations: [BettingProfitAndLossComponent, MarketTypeDetailsComponent],
  imports: [
    CommonModule,
    BettingProfitAndLossRoutingModule,
    SharedModule
  ]
})
export class BettingProfitAndLossModule { }
