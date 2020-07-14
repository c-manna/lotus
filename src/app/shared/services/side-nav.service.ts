import { Injectable, EventEmitter } from '@angular/core';
// import { DrawerComponent } from './drawer/drawer.component';
// import { MatSidenav } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
@Injectable(
  { providedIn: 'root' }
)
export class SideNavService {
  //public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  private drawer: MatDrawer;
  private drawer1: MatDrawer
  constructor() { }


  // public toggle() {
  //   return this.sideNavToggleSubject.next(null);
  // } 



  setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
    //console.log('tarasis',this.drawer)
  }

  toggle(): void {
    this.drawer.toggle();
  }



  setDrawer1(drawer: MatDrawer) {
    this.drawer1 = drawer;
    // console.log('tarasis',this.drawer)
  }

  toggle1(): void {
    this.drawer1.toggle();
  }

  close(){
    this.drawer.close();
    this.drawer1.close();
  }
}