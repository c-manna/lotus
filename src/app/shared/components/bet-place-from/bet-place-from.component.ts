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
  @Output() profit_and_liability: any = new EventEmitter();
  inputData: number;
  stakeValue: number = 0;
  viewMode = '';
  calculatedValue: any = 0;
  checkBoxConfirmation: boolean = true;
  eventData: any;
  eventDeatils: any;
  matchOdds: any = [];
  ipAddress;
  returnExposure: any = {};
  settingData: any = {};
  previousData: any;

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
      console.log(this.eventData)
    });

    this.ds.matchOdds$.subscribe(data => {
      this.matchOdds = data;
    });
    this.getIP();
  }

  getExposure() {
    let param: any = {};
    param.user_id = '8349711Z001';
    param.match_id = this.eventDeatils.event.id;
    this._loadingService.show();
    this.apiService.ApiCall(param, environment.apiUrl + 'getexposure', 'post').subscribe(
      result => {
        if (result.success) {
          this._loadingService.hide();
          console.log('exposure', result);
          this.previousData = result.result[result.result.length - 1];
          console.log(this.previousData)
        }
      },
      err => {
        this._loadingService.hide();
      }
    );
  }

  getIP() {
    this.ipService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  canceBet() {
    this.betCancelled.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ds.eventDeatils$.subscribe(event => {
      this.eventDeatils = event;
      this.getExposure();
    });
    this.ds.settingData$.subscribe(data => {
      this.settingData = data;
      console.log(this.settingData)
    });
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
      this.returnExposure.value = Math.abs(this.calculatedValue);
      this.returnExposure.stake = -Math.abs(this.stakeValue);
    } else {
      this.calculatedValue = (parseFloat((this.inputData - 1).toString()) * parseFloat(this.stakeValue.toString())).toFixed(2);
      this.returnExposure.value = -Math.abs(this.calculatedValue);
      this.returnExposure.stake = Math.abs(this.stakeValue);
    }
    if (this.stakeValue.toString() == '') {
      this.calculatedValue = 0.00;
    } else {
      this.returnExposure.index = this.details.index;
      this.profit_and_liability.emit(this.returnExposure);
    }
  }

  betPlace() {
    let total_balance = this.previousData.net_exposure + this.previousData.available_balance;
    let liability = this.selectedItem.type === 'back' ? Math.abs(this.returnExposure.stake) : Math.abs(this.returnExposure.value)
    console.log('liability', liability, 'tot', total_balance, 'net_exposure', this.previousData.net_exposure, 'exposure_limit', this.previousData.exposure_limit)
    if (((liability + this.previousData.net_exposure) <= total_balance) && ((liability + this.previousData.net_exposure) <= this.previousData.exposure_limit)) {
      if (this.checkBoxConfirmation) {
        const dialogRef = this.dialog.open(BetplaceConfirmationPopupComponent, {
          width: '250px',
          data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result)
            this.loader();
        });
      }
      else {
        this.loader();
      }
    }
    else {
      if ((liability + this.previousData.net_exposure) > total_balance)
        this._snakebarService.show('error', 'insufficient funds');
      if ((liability + this.previousData.net_exposure) > this.previousData.exposure_limit)
        this._snakebarService.show('error', 'exposure limit cross');
    }
  }

  loader() {
    let EnentList = ["Cricket","Tennis","Football","Soccer"];
    let loaderTime;
    if(EnentList.indexOf(this.eventData.name)!== -1)
      loaderTime = 5000;
    else
      loaderTime = 7000;
    this._loadingService.show();
    this.canceBet();
    setTimeout(() => {
      this.insertBet();
      this._loadingService.hide();
    }, loaderTime);
  }

  insertBet() {
    let param = {
      market_id: this.details.marketId,
      match_id: this.eventDeatils.event.id,
      market_type: this.details.market_type,
      description: this.eventDeatils.event.name,
      event_name: this.eventData.name,
      event_id: this.eventData.eventType,
      odd: this.selectedItem.type == 'back' ? 0 : 1,
      place_odd: this.inputData,
      last_odd: this.selectedItem.type == 'back' ? this.matchOdds[0].runners[this.details.index].ex.availableToBack[0].price : this.matchOdds[0].runners[this.details.index].ex.availableToLay[0].price,
      stake: this.stakeValue,
      runner_name: this.details.runnerName,
      runners: this.details.runners,
      market_start_time: this.details.market_start_time,
      market_end_time: "",
      user_ip: this.ipAddress,
      selection_id: "",
      user_id: '8349711Z001',
      p_and_l: 0,
      bet_status: 0,
      market_status: 0,
      bet_id: "111",
      settled_time: "2020-08-14T11:00:00.000Z",
    };

    console.log(param);

    this.apiService.ApiCall(param, environment.apiUrl + 'single-place-bet', 'post').subscribe(
      result => {
        if (result.success) {
          this._snakebarService.show('success', result.message);
        }
        else{
          this._snakebarService.show('error', result.message);
        }
      },
      err => {
        this._snakebarService.show('error', err);
      }
    );
  }

}
