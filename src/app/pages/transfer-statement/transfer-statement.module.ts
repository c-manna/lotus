import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferStatementRoutingModule } from './transfer-statement-routing.module';
import { TransferStatementComponent } from './transfer-statement.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [TransferStatementComponent],
  imports: [
    CommonModule,
    TransferStatementRoutingModule,
    SharedModule
  ]
})
export class TransferStatementModule { }
