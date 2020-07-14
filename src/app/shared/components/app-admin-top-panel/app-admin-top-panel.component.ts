import { Component, OnInit } from '@angular/core';
import { SideNavService } from '@shared/services';

@Component({
  selector: 'app-app-admin-top-panel',
  templateUrl: './app-admin-top-panel.component.html',
  styleUrls: ['./app-admin-top-panel.component.scss']
})
export class AppAdminTopPanelComponent implements OnInit {

  constructor(private toolbarService: SideNavService) { }

  ngOnInit(): void {
  }

  toggleDrawer() {
    this.toolbarService.toggle();
    // this.toolbarService.close();
}

toggleDrawer1() {
  this.toolbarService.toggle1();
  // this.toolbarService.toggle();
}

}
