import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { SharedModule } from '@shared/shared.module';
import { SigninComponent } from '@app/pages/sessions';
import { SessionsRoutes } from '@app/pages/sessions/sessions.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(SessionsRoutes)
  ],
  declarations: [SigninComponent]
})
export class SessionsModule { }