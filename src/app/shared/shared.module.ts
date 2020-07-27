import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { AuthGuard } from './services/auth/auth.guard';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SharedCoreModule } from '@shared/core';
import { BetPlaceFromComponent } from '@shared/components/bet-place-from/bet-place-from.component';
import { BetplaceConfirmationPopupComponent } from '@shared/components/betplace-confirmation-popup/betplace-confirmation-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BetPlaceFromComponent, BetplaceConfirmationPopupComponent],
  imports: [
    FormsModule,
    CommonModule,
    SharedComponentsModule,
    NgMaterialModule,
    RxReactiveFormsModule,
    ReactiveFormsModule,
    SharedCoreModule
  ],
  exports: [
    SharedComponentsModule,
    NgMaterialModule,
    RxReactiveFormsModule,
    SharedCoreModule,
    BetPlaceFromComponent, BetplaceConfirmationPopupComponent
  ],
  providers: [AuthGuard]
})
export class SharedModule { }
