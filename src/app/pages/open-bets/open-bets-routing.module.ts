import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenBetsComponent } from './open-bets.component';

const routes: Routes = [{ path: '', component: OpenBetsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenBetsRoutingModule { }
