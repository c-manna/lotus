import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { AuthGuard } from './services/auth/auth.guard';
import { NgMaterialModule } from './ng-material/ng-material.module';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    NgMaterialModule
  ],
  exports: [
    SharedComponentsModule,
    NgMaterialModule
  ],
  providers: [AuthGuard]
})
export class SharedModule { }
