import { Injectable } from '@angular/core';
import {
  MatSnackBar, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SnackBarComponent } from "../../shared/components/snack-bar/snack-bar.component";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

}



@Injectable({
  providedIn: 'root'
})
export class SnakebarService {

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  success(msg: String) {
    let horizontalPosition: MatSnackBarHorizontalPosition = 'center',// 'start' | 'center' | 'end' | 'left' | 'right';
      verticalPosition: MatSnackBarVerticalPosition = 'top'; //'top' | 'bottom'
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 500000,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      data: { msg: msg, type: 'success' }
    });
  }

  error(msg: String) {
    let horizontalPosition: MatSnackBarHorizontalPosition = 'center',// 'start' | 'center' | 'end' | 'left' | 'right';
      verticalPosition: MatSnackBarVerticalPosition = 'top'; //'top' | 'bottom'
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 500000,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      data: { msg: msg, type: 'error' }
    });
  }
}
