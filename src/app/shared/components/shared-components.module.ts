import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent, AuthLayoutComponent, AdminFooterPanelComponent, AdminLeftPanelComponent, AdminRightsidePanelComponent, AppAdminTopPanelComponent } from '@shared/components';

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
    RouterModule
  ],
  declarations: components,
  entryComponents: [],
  exports: [components]
})
export class SharedComponentsModule {}