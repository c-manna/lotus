import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyMarketRoutingModule } from './my-market-routing.module';
import { MyMarketPageComponent } from './my-market-page/my-market-page.component';


@NgModule({
  declarations: [MyMarketPageComponent],
  imports: [
    CommonModule,
    MyMarketRoutingModule
  ]
})
export class MyMarketModule { }
