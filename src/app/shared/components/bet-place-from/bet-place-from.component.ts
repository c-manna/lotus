import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BetplaceConfirmationPopupComponent } from '../betplace-confirmation-popup/betplace-confirmation-popup.component';

@Component({
  selector: 'app-bet-place-from',
  templateUrl: './bet-place-from.component.html',
  styleUrls: ['./bet-place-from.component.scss']
})
export class BetPlaceFromComponent implements OnInit {
  @Output() betCancelled: any = new EventEmitter();
  @Input('selectedItem') selectedItem: any;
  inputData: number;
  stakeValue: number = 0;
  viewMode = '';
  calculatedValue: any = 0;
  checkBoxConfirmation: boolean;


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  canceBet() {
    this.betCancelled.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.stakeValue = 0;
    this.calculatedValue = 0;
    this.selectedItem = changes.selectedItem.currentValue;
    this.inputData = this.selectedItem[this.selectedItem.type];
  }

  addValue() {
    let value = (this.inputData + 0.1).toFixed(2);
    this.inputData = parseFloat(value);
    this.calculateValue();
  }

  subValue() {
    let value = (this.inputData - 0.1).toFixed(2);
    this.inputData = parseFloat(value);
    this.calculateValue();
  }

  addStakeValue(value) {
    this.stakeValue += value;
    this.calculateValue();
  }

  calculateValue() {
    if (this.selectedItem.type === 'back') {
      this.calculatedValue = ((this.inputData - 1) * this.stakeValue).toFixed(2);
    } else {
      this.calculatedValue = ((this.inputData - 1) * this.stakeValue).toFixed(2);
    }
  }

  betPlace() {
    console.log("checkBoxConfirmation==", this.checkBoxConfirmation);
    if (this.checkBoxConfirmation) {
      console.log("open popup");
      //open popup
      const dialogRef = this.dialog.open(BetplaceConfirmationPopupComponent, {
        width: '250px',
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }

}
