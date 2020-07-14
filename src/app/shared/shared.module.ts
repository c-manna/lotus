import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { AuthGuard } from './services/auth/auth.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedComponentsModule
  ],
  exports: [ 
    SharedComponentsModule,
  ],
  providers: [AuthGuard]
})
export class SharedModule { }
