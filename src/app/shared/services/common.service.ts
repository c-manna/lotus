import { Injectable, ComponentFactoryResolver } from '@angular/core';
import {
  MatSnackBar, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SnackBarComponent } from "../../shared/components/snack-bar/snack-bar.component";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { APIService } from './api.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private apiService: APIService) { }

  getExposureForFancy(param, callback: any = null) {
    this.apiService.ApiCall(param, environment.apiUrl + 'getExposureFancy', 'post').subscribe(
      result => {
        if (callback != null) { callback(result.result); }
      },
      err => { }
    );
  }

  getExposure(param, callback: any = null) {
    this.apiService.ApiCall(param, environment.apiUrl + 'getexposure', 'post').subscribe(
      result => {
        if (callback != null) { callback(result.result); }
      },
      err => { }
    );
  }
}



type horizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
type verticalPosition = 'top' | 'bottom';
type snackBarType = 'success' | 'error' | 'warning';
interface options {
  horizontalPosition?: horizontalPosition,
  verticalPosition?: verticalPosition,
  duration?: number
}

@Injectable({
  providedIn: 'root'
})
export class SnakebarService {
  constructor(
    private _snackBar: MatSnackBar
  ) { }

  show(type: snackBarType, msg: String, options?: options) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: (options && options.duration) ? options.duration : 5000,
      horizontalPosition: (options && options.horizontalPosition) ? options.horizontalPosition : 'center',
      verticalPosition: (options && options.verticalPosition) ? options.verticalPosition : 'top',
      data: { msg: msg, type: type }
    });
  }
}


@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  overlayRef: OverlayRef;
  constructor(
    private overlay: Overlay,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  show() {
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    });
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingComponent);
    this.overlayRef.attach<LoadingComponent>(new ComponentPortal(componentFactory.componentType));
    // setTimeout(() => {
    //   this.overlayRef.detach();
    // }, 10000)
  }

  hide() {
    this.overlayRef.detach();
  }

}

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor(private http: HttpClient) { }
  public getIPAddress() {
    return this.http.get("http://api.ipify.org/?format=json");
  }
} 