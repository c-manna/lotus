import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { LoadingComponent } from '../components/loading/loading.component';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { APIService } from './api.service';
import { DataService } from './data.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private apiService: APIService,
    private ds: DataService) { }

    getEvents() {
      this.apiService.ApiCall('', environment.apiUrl + 'event', 'get').subscribe(result => {
        if (result.success) {
          result.data.forEach(function(item,i){
            if(item.eventType == 4){
              result.data.splice(i, 1);
              result.data.unshift(item);
            }
          });
          this.ds.changeEvents(result.data);
        }
      }, err => {});
    }

    getSettingData() {
      this.apiService.ApiCall({}, `${environment.apiUrl}setting`, 'get').subscribe(res => {
        if (res.success) {
          this.ds.changeSettingData(res.data);
        }
      }, err => {});
    }

    getOpenBets() {
      this.apiService.ApiCall({}, environment.apiUrl + 'open-bet', 'get').subscribe(
        result => {
          if (result.success) {
            this.ds.changeOpenBets(result['data']);
            this.ds.changeOpenBetLength(result['data'].length);
          }
        },
        err => {}
      );
    }

  setEventInfo(id){
    this.ds.events$.subscribe(data => {
      if (data) {
        this.ds.changeEvent(data.find( ({ eventType }) => eventType === id ));
      }else{
        this.ds.changeEvent([]);
      }
    });
  }

  setEventDetailsInfo(eventId,competitionId,matchId){
    this.apiService.ApiCall('', environment.apiUrl + 'fetch-match-series?eventID=' + eventId + '&competitionId=' + competitionId, 'get').subscribe(
      result => {
        if (result.success) {
          result.data.find( ({ event }) => event.id === matchId )
          this.ds.changeEventDetails(result.data.find( ({ event }) => event.id === matchId ));
        }
        else {
          this.ds.changeEventDetails([]);
        }
      },
      err => {
      }
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
      panelClass: [type=='error'?'red-background':'green-background'],
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