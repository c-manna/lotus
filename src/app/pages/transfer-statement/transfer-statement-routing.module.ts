import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferStatementComponent } from './transfer-statement.component';

const routes: Routes = [{ path: '', component: TransferStatementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferStatementRoutingModule { }
