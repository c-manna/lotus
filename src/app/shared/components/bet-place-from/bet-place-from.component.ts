import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BetplaceConfirmationPopupComponent } from '../betplace-confirmation-popup/betplace-confirmation-popup.component';
import { APIService, DataService } from '@shared/services';
import { environment } from '@env/environment';

@Component({
  selector: 'app-bet-place-from',
  templateUrl: './bet-place-from.component.html',
  styleUrls: ['./bet-place-from.component.scss']
})
export class BetPlaceFromComponent implements OnInit {
  @Output() betCancelled: any = new EventEmitter();
  @Input('selectedItem') selectedItem: any;
  @Input('details') details: any;

  inputData: number;
  stakeValue: number = 0;
  viewMode = '';
  calculatedValue: any = 0;
  checkBoxConfirmation: boolean;
  eventData: any;
  eventDeatils:any;
  matchOdds:any= [];

  constructor(
    private ds: DataService,
    private apiService: APIService,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {
    //console.log(this.details);
    //console.log(this.selectedItem);
    this.ds.event$.subscribe(event => {
      this.eventData = event;
    });

    this.ds.eventDeatils$.subscribe(event => {
      this.eventDeatils = event;
      //console.log(event)
    });

    this.ds.matchOdds$.subscribe(data => {
      this.matchOdds = data;
      //console.log(this.matchOdds[0].runners[this.details.index])
      console.log('last odd',this.selectedItem.type=='back'?this.matchOdds[0].runners[this.details.index].ex.availableToBack[0].price:this.matchOdds[0].runners[this.details.index].ex.availableToLay[0].price)
    });
  }

  canceBet() {
    this.betCancelled.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.stakeValue = 0;
    this.calculatedValue = 0;
    this.selectedItem = changes.selectedItem.currentValue;
    this.inputData = this.selectedItem.value;
  }

  addValue() {
    let value = (this.inputData + 0.01).toFixed(2);
    this.inputData = parseFloat(value);
    this.calculateValue();
  }

  subValue() {
    let value = (this.inputData - 0.01).toFixed(2);
    this.inputData = parseFloat(value);
    this.calculateValue();
  }

  addStakeValue(value) {
    if (this.stakeValue.toString() != '')
      this.stakeValue = parseFloat(this.stakeValue.toString()) + parseFloat(value);
    else
      this.stakeValue = parseFloat(value);
    this.calculateValue();
  }

  calculateValue() {
    if (this.selectedItem.type === 'back') {
      this.calculatedValue = (parseFloat((this.inputData - 1).toString()) * parseFloat(this.stakeValue.toString())).toFixed(2);
    } else {
      this.calculatedValue = (parseFloat((this.inputData - 1).toString()) * parseFloat(this.stakeValue.toString())).toFixed(2);
    }
    if (this.stakeValue.toString() == '') {
      this.calculatedValue = 0.00;
    }
  }

  betPlace() {
    console.log("checkBoxConfirmation==", this.checkBoxConfirmation);
    if (this.calculatedValue > 0) {
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
      else {
        // display loader
      }
    }
    else if (this.stakeValue == 0) {

    }
  }

  insertBet() {
    let param = {
      market_id: this.details.marketId,
      match_id: this.eventDeatils.event.id,
      market_type: this.details.market_type,
      description: this.eventDeatils.event.name,
      event_name: this.eventData.name,
      odd: this.selectedItem.type=='back'?0:1,
      place_odd: this.inputData,
      last_odd: this.selectedItem.type=='back'?this.matchOdds[0].runners[this.details.index].ex.availableToBack[0].price:this.matchOdds[0].runners[this.details.index].ex.availableToLay[0].price,
      stake: this.stakeValue,
      runner_name: this.details.runnerName,
      user_ip: ''
    };

    this.apiService.ApiCall(param, environment.apiUrl + 'place-bet', 'get').subscribe(
      result => {
        if (result.success) {
          console.log(result)
        }
      },
      err => {
      }
    );
  }

}
