import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { AuthGuard } from './services/auth/auth.guard';
import { BetPlaceFromComponent } from './bet-place-from/bet-place-from.component';

@NgModule({
  declarations: [BetPlaceFromComponent],
  imports: [
    CommonModule,
    SharedComponentsModule
  ],
  exports: [
    SharedComponentsModule,
    BetPlaceFromComponent
  ],
  providers: [AuthGuard]
})
export class SharedModule { }
