import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent, AuthLayoutComponent, AdminFooterPanelComponent, AdminLeftPanelComponent, AdminRightsidePanelComponent, AppAdminTopPanelComponent } from '@shared/components';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDrawer } from '@angular/material/sidenav';
import { BetPlaceFromComponent } from './bet-place-from/bet-place-from.component';
import { BetplaceConfirmationPopupComponent } from './betplace-confirmation-popup/betplace-confirmation-popup.component';
import { MatDialogModule } from '@angular/material/dialog';

const components = [
  AdminLayoutComponent,
  AuthLayoutComponent,
  AdminFooterPanelComponent,
  AdminLeftPanelComponent,
  AdminRightsidePanelComponent,
  AppAdminTopPanelComponent,
  BetPlaceFromComponent,
  BetplaceConfirmationPopupComponent
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSidenavModule,
    MatDialogModule
  ],
  declarations: components,
  entryComponents: [],
  providers: [MatDrawer],
  exports: [components]
})
export class SharedComponentsModule { }