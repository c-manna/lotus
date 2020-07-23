import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { AuthGuard } from './services/auth/auth.guard';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SharedCoreModule } from '@shared/core';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    NgMaterialModule,
    RxReactiveFormsModule,
    SharedCoreModule
  ],
  exports: [
    SharedComponentsModule,
    NgMaterialModule,
    RxReactiveFormsModule,
    SharedCoreModule
  ],
  providers: [AuthGuard]
})
export class SharedModule { }
