import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyMarketPageComponent } from './my-market-page/my-market-page.component';


const routes: Routes = [{
  path: '',
  component: MyMarketPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyMarketRoutingModule { }
