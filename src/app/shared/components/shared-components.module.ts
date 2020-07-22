import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent, AuthLayoutComponent, AdminFooterPanelComponent, AdminLeftPanelComponent, AdminRightsidePanelComponent, AppAdminTopPanelComponent } from '@shared/components';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDrawer } from '@angular/material/sidenav';
import { BetPlaceFromComponent } from './bet-place-from/bet-place-from.component';

const components = [
  AdminLayoutComponent,
  AuthLayoutComponent,
  AdminFooterPanelComponent,
  AdminLeftPanelComponent,
  AdminRightsidePanelComponent,
  AppAdminTopPanelComponent,
  BetPlaceFromComponent
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSidenavModule
  ],
  declarations: components,
  entryComponents: [],
  providers: [MatDrawer],
  exports: [components]
})
export class SharedComponentsModule { }