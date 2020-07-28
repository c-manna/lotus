import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { SharedModule } from '@shared/shared.module';
import { SigninComponent } from '@app/pages/sessions/index';
import { SessionsRoutes } from '@app/pages/sessions/sessions.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(SessionsRoutes)
  ],
  declarations: [SigninComponent]
})
export class SessionsModule { }