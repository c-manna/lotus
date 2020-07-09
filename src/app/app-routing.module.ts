import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent, AuthLayoutComponent } from '@shared/components';
import { AuthGuard } from '@shared/services/auth';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: () => import('./pages/sessions/sessions.module').then(m => m.SessionsModule),
    data: { title: 'Session' }
  },
  {
    path: '',
    component: AdminLayoutComponent,
    //canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
