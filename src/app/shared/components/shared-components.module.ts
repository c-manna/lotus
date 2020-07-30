import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminLayoutComponent,
  AuthLayoutComponent,
  AdminFooterPanelComponent,
  AdminLeftPanelComponent,
  AdminRightsidePanelComponent,
  AppAdminTopPanelComponent
} from '@shared/components';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const components = [
  AdminLayoutComponent,
  AuthLayoutComponent,
  AdminFooterPanelComponent,
  AdminLeftPanelComponent,
  AdminRightsidePanelComponent,
  AppAdminTopPanelComponent
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSidenavModule,
    MatSnackBarModule
  ],
  declarations: components,
  entryComponents: [],
  providers: [MatDrawer],
  exports: components
})
export class SharedComponentsModule { }