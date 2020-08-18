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
  @Input('settingData') settingData: any;
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
  previousData: any;
  previousBet: any;

  constructor(
    private ipService: IpService,
    private ds: DataService,
    private apiService: APIService,
    public dialog: MatDialog,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService) {

  }

  ngOnInit(): void {
    this.ds.eventDeatils$.subscribe(event => {
      this.eventDeatils = event;
      if(this.details.counter==-1){
        this.getExposure();
      }
    });
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
    param.user_id = this.details.user_id;
    param.match_id = this.eventDeatils.event.id;
    /* if (this.settingData.one_click_betting == 1){
      this._loadingService.show();
    } */
    this.apiService.ApiCall(param, environment.apiUrl + 'getexposure', 'post').subscribe(
      result => {
        if (result.success) {
          console.log('exposure', result);
          this.previousData = result.result[result.result.length - 1];
          this.previousBet = result.result;
          console.log(this.previousData)
          console.log(this.settingData)
          if (this.settingData.one_click_betting == 1&&this.details.counter==-1) {
            this.details.counter=0;
            if (this.settingData.one_click_default == 1)
              this.addStakeValue(this.settingData.one_click_op1);
            else if (this.settingData.one_click_default == 2)
              this.addStakeValue(this.settingData.one_click_op2);
            else
              this.addStakeValue(this.settingData.one_click_op3);
            let total_balance = this.previousData.net_exposure + this.previousData.available_balance;
            let liability = this.selectedItem.type === 'back' ? Math.abs(this.returnExposure.stake) : Math.abs(this.returnExposure.value);
            if (((liability + this.previousData.net_exposure) <= total_balance) && ((liability + this.previousData.net_exposure) <= this.previousData.exposure_limit)) {
              const dialogRef = this.dialog.open(BetplaceConfirmationPopupComponent, {
                width: '100%',
                panelClass: 'custom-modalbox',
                data: { description: this.eventDeatils.event.name, runner_name: this.details.runnerName, selectionType: this.selectedItem.type, odds: this.inputData, stake: this.stakeValue, p_and_l: this.calculatedValue }
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result)
                  this.loader();
              });
            }
            else {
              if ((liability + this.previousData.net_exposure) > total_balance)
                this._snakebarService.show('error', 'insufficient funds');
              if ((liability + this.previousData.net_exposure) > this.previousData.exposure_limit)
                this._snakebarService.show('error', 'exposure limit cross');
              this.profit_and_liability.emit([]);
            }
          }
        }
        this._loadingService.hide();
        this.details.counter=0;
      },
      err => {
        this._loadingService.hide();
        this.details.counter=0;
      }
    );
  }

  getIP() {
    this.ipService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      console.log(this.ipAddress)
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
          width: '100%',
          panelClass: 'custom-modalbox',
          data: { description: this.eventDeatils.event.name, runner_name: this.details.runnerName, selectionType: this.selectedItem.type, odds: this.inputData, stake: this.stakeValue, p_and_l: this.calculatedValue }
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
        this._snakebarService.show('error', 'Insufficient funds');
      if ((liability + this.previousData.net_exposure) > this.previousData.exposure_limit)
        this._snakebarService.show('error', 'Exposure limit exceed');
    }
  }

  loader() {
    let EnentList = ["Cricket", "Tennis", "Football", "Soccer"];
    let loaderTime;
    if (EnentList.indexOf(this.eventData.name) !== -1)
      loaderTime = 1000;
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
    let currentBet: any = [];
    let currentRunnerName = this.details.runnerName;
    let odd = this.selectedItem.type == 'back' ? 0 : 1;
    let all_amount: any = [];
    let net_exposure;
    for (let i = 0; i < this.details.runners.length; i++) {
      let team_details: any = {};
      if (currentRunnerName == this.details.runners[i].runnerName) {
        team_details = {
          odd_type: odd,
          team_name: currentRunnerName,
          amount: this.returnExposure.value
        }
      } else {
        team_details = {
          odd_type: odd == 0 ? 1 : odd,
          team_name: this.details.runners[i].runnerName,
          amount: this.returnExposure.stake
        }
      }
      all_amount.push(team_details.amount)
      currentBet.push(team_details)
    }
    console.log('current exposure',all_amount)
    console.log('previous exposure',this.previousBet[0].all_teams_exposure_data)
    if (this.previousBet[0].all_teams_exposure_data) {
      for (let i = 0; i < this.previousBet.length; i++) {
        for (let j = 0; j < this.previousBet[i].all_teams_exposure_data.length; j++) {
          all_amount[j]=all_amount[j] + this.previousBet[i].all_teams_exposure_data[j].amount;
        }
      }
      console.log('total calculation',all_amount)
      net_exposure = this.min(all_amount);
    } else {
      net_exposure = this.min(all_amount);
    }

    if(net_exposure>=0){
      net_exposure = 0;
    }
    let last_odd;
    if(this.matchOdds){
      last_odd = this.selectedItem.type == 'back' ? this.matchOdds[0].runners[this.details.index].ex.availableToBack[0].price : this.matchOdds[0].runners[this.details.index].ex.availableToLay[0].price
    }else{
      last_odd = this.inputData.toFixed(2)
    }
    let param = {
      market_id: this.details.marketId,
      match_id: this.eventDeatils.event.id,
      market_type: this.details.market_type,
      description: this.eventDeatils.event.name,
      event_name: this.eventData.name,
      event_id: this.eventData.eventType,
      odd: this.selectedItem.type == 'back' ? 0 : 1,
      place_odd: this.inputData.toFixed(2),
      last_odd: last_odd,
      stake: this.stakeValue,
      runner_name: this.details.runnerName,
      runners: this.details.runners,
      market_start_time: this.details.market_start_time,
      market_end_time: null,
      user_ip: this.ipAddress,
      selection_id: null,
      user_id: this.details.user_id,
      p_and_l: null,
      bet_status: 0,
      market_status: 0,
      bet_id: "111",
      settled_time: null,
      master_id: this.details.punter_belongs_to,
      net_exposure: net_exposure,
      amount: null,
      available_balance: (this.previousData.available_balance-this.stakeValue)
    };

    console.log(param);

    this.apiService.ApiCall(param, environment.apiUrl + 'single-place-bet', 'post').subscribe(
      result => {
        if (result.success) {
          this._snakebarService.show('success', result.message);
        }
        else {
          this._snakebarService.show('error', result.message);
        }
      },
      err => {
        this._snakebarService.show('error', err);
      }
    );
  }

  min(input) {
    if (toString.call(input) !== "[object Array]")
      return false;
    return Math.min.apply(null, input);
  }

}
