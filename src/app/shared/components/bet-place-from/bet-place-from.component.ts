import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BetplaceConfirmationPopupComponent } from '../betplace-confirmation-popup/betplace-confirmation-popup.component';
import { APIService, DataService, LoadingService, SnakebarService, IpService, CommonService } from '@shared/services';
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
  @Input() maxBetMaxMarket: any;
  previousBet: any = [];
  @Output() profit_and_liability: any = new EventEmitter();
  inputData: number;
  stakeValue: number;
  viewMode = '';
  calculatedValue: any = 0;
  checkBoxConfirmation: boolean = true;
  matchOdds: any = [];
  bookMaker: any = [];
  ipAddress;
  returnExposure: any = {};
  balanceInfo: any = {};
  sum_of_max_market;

  constructor(
    private ipService: IpService,
    private commonService: CommonService,
    private ds: DataService,
    private apiService: APIService,
    public dialog: MatDialog,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService) {}

  ngOnInit(): void {
    if (this.settingData.one_click_betting == 1) this.IsOneClickBet();
    this.getMaxMarketSummation();
    this.ds.balanceInfo$.subscribe(data => {
      this.balanceInfo = data;
    });
    console.log(this.details);
    //console.log(this.selectedItem);
    if (this.details.market_type != 'bookmaker') {
      this.ds.matchOdds$.subscribe(data => {
        this.matchOdds = data;
        //console.log(this.matchOdds);
      });
    } else {
      this.ds.bookMaker$.subscribe(data => {
        this.bookMaker = data;
      });
    }
    this.ds.checkBoxConfirmation$.subscribe(data => {
      this.checkBoxConfirmation = data;
    });
    this.getOpenBets();
    this.getIP();
  }

  checkboxOnChange(event){
    this.ds.changeCheckBoxConfirmation(event.target.checked);
  }

  getOpenBets() {
    this.ds.openBets$.subscribe(data => {
      if (data) {
        this.previousBet = [];
        data.forEach(item => {
          if (item.market_id == this.details.marketId) {
            this.previousBet.push(item);
          }
        });
        if (this.previousBet.length) {
          let exposure: any = {};
          exposure.previous = this.previous_exposure_calculation();
          exposure.current = this.set_current_bet_amount();
          this.profit_and_liability.emit(exposure);
        } else {
          let exposure: any = {};
          exposure.previous = [];
          exposure.current = this.set_current_bet_amount();
          this.profit_and_liability.emit(exposure);
        }
      }
    });
  }

  getMaxMarketSummation() {
    this.apiService.ApiCall({ market_type: this.details.market_type }, environment.apiUrl + 'getMaxMarketSummation', 'post').subscribe(
      result => {
        if (result.success) {
          this.sum_of_max_market = result;
        }
      },
      err => {
        this._snakebarService.show('error', err);
      }
    );
  }

  IsOneClickBet() {
    if (this.settingData.one_click_default == 1)
      this.addStakeValue(this.settingData.one_click_op1);
    else if (this.settingData.one_click_default == 2)
      this.addStakeValue(this.settingData.one_click_op2);
    else
      this.addStakeValue(this.settingData.one_click_op3);
    const dialogRef = this.dialog.open(BetplaceConfirmationPopupComponent, {
      width: '100%',
      panelClass: 'custom-modalbox',
      data: { event_name: this.details.event_name, description: this.details.description, runner_name: this.details.runnerName, selectionType: this.selectedItem.type, odds: this.inputData, stake: this.stakeValue, p_and_l: this.calculatedValue, isLoad: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.canceBet();
        this.insertBet();
      } else {
        this.canceBet()
      }
    });
  }

  getIP() {
    this.ipService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      //console.log(this.ipAddress)
    });
  }

  canceBet() {
    this.betCancelled.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.stakeValue = undefined;
    this.calculatedValue = 0;
    this.selectedItem = changes.selectedItem.currentValue;
    this.inputData = this.selectedItem.value;
    console.log(this.selectedItem)
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
    if (this.stakeValue == undefined) this.stakeValue = 0;
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
      let exposure: any = {};
      let all_amount: any = this.set_current_bet_amount();
      console.log(all_amount)
      if (this.previousBet && this.previousBet.length) {
        exposure.previous = this.previous_exposure_calculation();
        exposure.current = this.current_exposures_calculation(all_amount);

      } else {
        exposure.previous = [];
        exposure.current = all_amount;
      }
      this.profit_and_liability.emit(exposure);
    }
  }

  betPlace() {
    if (this.checkBoxConfirmation) {
      const dialogRef = this.dialog.open(BetplaceConfirmationPopupComponent, {
        width: '100%',
        panelClass: 'custom-modalbox',
        data: { event_name: this.details.event_name, description: this.details.description, runner_name: this.details.runnerName, selectionType: this.selectedItem.type, odds: this.inputData, stake: this.stakeValue, p_and_l: this.calculatedValue, isLoad: false }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.canceBet();
          this.insertBet();
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(BetplaceConfirmationPopupComponent, {
        width: '100%',
        panelClass: 'custom-modalbox',
        data: { event_name: this.details.event_name, description: this.details.description, runner_name: this.details.runnerName, selectionType: this.selectedItem.type, odds: this.inputData, stake: this.stakeValue, p_and_l: this.calculatedValue, isLoad: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.canceBet();
          this.insertBet();
        }
      });
    }
  }

  set_current_bet_amount() {
    let all_amount: any = [];
    for (let i = 0; i < this.details.runners.length; i++) {
      let amount = 0;
      if (this.details.runnerName == this.details.runners[i].runnerName) {
        amount = this.returnExposure.value
      } else {
        amount = this.returnExposure.stake
      }
      all_amount.push(amount);
    }
    return (all_amount);
  }

  previous_exposure_calculation() {
    let tmpData = JSON.parse(this.previousBet[this.previousBet.length - 1].all_teams_exposure_data)
    let all_amount: any = Array.apply(null, new Array(tmpData.length)).map(Number.prototype.valueOf, 0);
    for (let i = 0; i < this.previousBet.length; i++) {
      let l = JSON.parse(this.previousBet[i].all_teams_exposure_data);
      for (let j = 0; j < l.length; j++) {
        all_amount[j] = all_amount[j] + l[j].amount;
      }
    }
    return (all_amount);
  }

  current_exposures_calculation(all_amount: any = []) {
    for (let i = 0; i < this.previousBet.length; i++) {
      let l = JSON.parse(this.previousBet[i].all_teams_exposure_data)
      for (let j = 0; j < l.length; j++) {
        all_amount[j] = all_amount[j] + l[j].amount;
      }
    }
    return (all_amount);
  }

  insertBet() {
    let current_exposure;
    let prev_exposure = 0;
    let all_amount: any = this.set_current_bet_amount();
    console.log(all_amount)
    if (this.previousBet && this.previousBet.length) {
      prev_exposure = this.min(this.previous_exposure_calculation());
      current_exposure = this.min(this.current_exposures_calculation(all_amount));

    } else {
      current_exposure = this.min(all_amount);
    }

    if (current_exposure >= 0) {
      current_exposure = 0;
    }
    let total_balance = this.balanceInfo.net_exposure + this.balanceInfo.available_balance;
    let net_exposure = this.balanceInfo.net_exposure + Math.abs(current_exposure);
    console.log('net exposure', net_exposure, current_exposure, prev_exposure);
    if (this.stakeValue < 1000) {
      this._snakebarService.show('error', 'Minimum stake amount is Rs: 1000');
    }
    else if (this.stakeValue > parseInt(this.maxBetMaxMarket.max_bet)) {
      this._snakebarService.show('error', 'Max bet amount exceed');
    }
    else if ((this.stakeValue + this.sum_of_max_market) > parseInt(this.maxBetMaxMarket.max_market)) {
      this._snakebarService.show('error', 'Max market amount exceed');
    }
    else if (Math.abs(net_exposure) > total_balance) {
      this._snakebarService.show('error', 'Insufficient funds');
    }
    else if (Math.abs(net_exposure) > this.balanceInfo.balance_limit) {
      this._snakebarService.show('error', 'Exposure limit exceed');
    }
    else if ((Math.abs(net_exposure) <= total_balance) && (Math.abs(net_exposure) <= this.balanceInfo.balance_limit)) {
      let last_odd;
      let bet_status;
      if(this.selectedItem.type == 'back') bet_status = (last_odd>=this.inputData)?0:1;
      else bet_status = (last_odd<this.inputData)?0:1;
      if (this.details.market_type != 'bookmaker') {
        last_odd = this.selectedItem.type == 'back' ? this.matchOdds[this.details.index].runners[this.details.fragment].ex.availableToBack[0].price : this.matchOdds[this.details.index].runners[this.details.fragment].ex.availableToLay[0].price
      } else {
        last_odd = this.selectedItem.type == 'back' ? this.bookMaker.details.runners[this.details.fragment].back : this.bookMaker.details.runners[this.details.fragment].lay;
      }
      let param = {
        market_id: this.details.marketId,
        match_id: this.details.match_id,
        market_type: this.details.market_type,
        description: this.details.description,
        event_name: this.details.event_name,
        event_id: this.details.event_id,
        competition_id: this.details.competition_id,
        odd: this.selectedItem.type == 'back' ? 0 : 1,
        place_odd: this.inputData,
        last_odd: last_odd,
        stake: this.stakeValue,
        runner_name: this.details.runnerName,
        runners: this.details.runners,
        market_start_time: this.details.market_start_time,
        market_end_time: 0,
        user_ip: this.ipAddress,
        selection_id: 0,
        user_id: this.details.user_id,
        p_and_l: 0,
        bet_status: bet_status,
        market_status: 0,
        bet_id: "111",
        settled_time: 0,
        master_id: this.details.punter_belongs_to,
        current_exposure: Math.abs(current_exposure) - Math.abs(prev_exposure),
        amount: 0,
        liability: this.selectedItem.type === 'back' ? Math.abs(this.returnExposure.stake) : Math.abs(this.returnExposure.value)
      };
      console.log(param);
      this.apiService.ApiCall(param, environment.apiUrl + 'single-place-bet', 'post').subscribe(
        result => {
          if (result.success) {
            this.commonService.getOpenBets();
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
  }

  min(input) {
    if (toString.call(input) !== "[object Array]")
      return false;
    return Math.min.apply(null, input);
  }

}
