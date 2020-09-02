import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-betplace-confirmation-popup',
  templateUrl: './betplace-confirmation-popup.component.html',
  styleUrls: ['./betplace-confirmation-popup.component.scss']
})
export class BetplaceConfirmationPopupComponent implements OnInit {

  isBetPlace: boolean = false;
  loaderTime;
  timeInterval: any;
  countDownTime;

  constructor(
    public dialogRef: MatDialogRef<BetplaceConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //console.log(data);
    let EnentList = ["Cricket", "Tennis", "Football", "Soccer"];
    if (EnentList.indexOf(data.event_name) !== -1) {
      this.countDownTime = 5;
      this.loaderTime = 5000;
    }
    else {
      this.countDownTime = 7;
      this.loaderTime = 7000;
    }
  }

  ngOnInit() { }

  loader() {
    this.isBetPlace = true;
    this.secondCountDown();
    setTimeout(() => {
      this.closeDialog();
    }, this.loaderTime);
  }

  secondCountDown() {
    this.timeInterval = setInterval(() => {
      this.countDownTime--;
    }, 1000);
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval);
  }

}
