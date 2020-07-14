import { Routes } from "@angular/router";

import { LoginGuard } from '@shared/services/auth';
import { SigninComponent } from '@app/pages/sessions';

export const SessionsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SigninComponent,
        canActivate: [LoginGuard],
        data: { title: "Signin" }
      }
    ]
  }
];
