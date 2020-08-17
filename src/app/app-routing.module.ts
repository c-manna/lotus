import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AdminLayoutComponent, AuthLayoutComponent } from '@shared/components';
import { AuthGuard } from '@shared/services/auth';
import { SearchComponent } from './search/search.component'
import { MyMarketModule } from './pages/my-market/my-market.module';
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
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'series/:id',
        loadChildren: () => import('./pages/series/series.module').then(m => m.SeriesModule)
      },
      {
        path: 'open-bets',
        loadChildren: () => import('./pages/open-bets/open-bets.module').then(m => m.OpenBetsModule)
      },
      {
        path: 'betting-profit-and-loss',
        loadChildren: () => import('./pages/betting-profit-and-loss/betting-profit-and-loss.module').then(m => m.BettingProfitAndLossModule)
      },
      {
        path: 'transfer-statement',
        loadChildren: () => import('./pages/transfer-statement/transfer-statement.module').then(m => m.TransferStatementModule)
      },
      {
        path: 'rule-and-regulation',
        loadChildren: () => import('./pages/rule-and-regulation/rule-and-regulation.module').then(m => m.RuleAndRegulationModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'search',
        component: SearchComponent
      }, {
        path: 'my-market',
        loadChildren: () => import('./pages/my-market/my-market.module').then(m => MyMarketModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
