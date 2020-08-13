import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-betplace-confirmation-popup',
  templateUrl: './betplace-confirmation-popup.component.html',
  styleUrls: ['./betplace-confirmation-popup.component.scss']
})
export class BetplaceConfirmationPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<BetplaceConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

}
