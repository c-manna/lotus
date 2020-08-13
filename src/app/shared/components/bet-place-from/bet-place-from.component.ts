import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BetplaceConfirmationPopupComponent } from '../betplace-confirmation-popup/betplace-confirmation-popup.component';
import { APIService, DataService, LoadingService, SnakebarService, IpService } from '@shared/services';
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
  checkBoxConfirmation: boolean=false;
  eventData: any;
  eventDeatils:any;
  matchOdds:any= [];
  ipAddress;

  constructor(
    private ipService: IpService,
    private ds: DataService,
    private apiService: APIService,
    public dialog: MatDialog,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService) {

  }

  ngOnInit(): void {
    //console.log(this.details);
    //console.log(this.selectedItem);
    this.ds.event$.subscribe(event => {
      this.eventData = event;
    });

    this.ds.eventDeatils$.subscribe(event => {
      this.eventDeatils = event;
    });

    this.ds.matchOdds$.subscribe(data => {
      this.matchOdds = data;
    });
    this.getIP();
  }

  getIP()  
  {  
    this.ipService.getIPAddress().subscribe((res:any)=>{  
      this.ipAddress=res.ip;  
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
    if (this.calculatedValue > 0) {
      if (this.checkBoxConfirmation) {
        const dialogRef = this.dialog.open(BetplaceConfirmationPopupComponent, {
          width: '250px',
          data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result)
            this.loader();
        });
      }
      else {
        this.loader();
      }
    }
  }

  loader(){
    this._loadingService.show();
    setTimeout(()=>{
      this.insertBet();
      this._loadingService.hide();
    }, 5000);
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
      market_start_time: this.details.market_start_time,
      market_end_time: "",
      user_ip: this.ipAddress,
      selection_id: ""
    };

    console.log(param);

    this.apiService.ApiCall(param, environment.apiUrl + 'place-bet', 'post').subscribe(
      result => {
        this.canceBet();
        if (result.success) {
          
          console.log(result)
        }
      },
      err => {
      }
    );
  }

}
