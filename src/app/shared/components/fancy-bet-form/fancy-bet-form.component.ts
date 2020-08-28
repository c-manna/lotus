import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BetplaceConfirmationPopupComponent } from '../betplace-confirmation-popup/betplace-confirmation-popup.component';
import { APIService, DataService, LoadingService, SnakebarService, IpService, CommonService } from '@shared/services';
import { environment } from '@env/environment';

@Component({
  selector: 'app-fancy-bet-form',
  templateUrl: './fancy-bet-form.component.html',
  styleUrls: ['./fancy-bet-form.component.scss']
})
export class FancyBetFormComponent implements OnInit {
  @Output() betCancelled: any = new EventEmitter();
  @Input('selectedItem') selectedItem: any;
  @Input('details') details: any;
  @Input('settingData') settingData: any;
  @Input() maxBetMaxMarket: any = [];
  @Input() eventDeatils: any;
  @Input() previousBet: any;
  @Output() profit_and_liability: any = new EventEmitter();
  inputData: number;
  stakeValue: number;
  viewMode = '';
  calculatedValue: any = 0;
  checkBoxConfirmation: boolean = true;
  eventData: any;

  fancy: any = [];
  ipAddress;
  returnExposure: any = {};
  balanceInfo: any = {};
  sum_of_max_market;
  minValueOfFancy;

  constructor(
    private ipService: IpService,
    private ds: DataService,
    private commonService: CommonService,
    private apiService: APIService,
    public dialog: MatDialog,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService) {
  }

  ngOnInit(): void {
    if (this.settingData.one_click_betting == 1) this.IsOneClickBet();
    this.getMaxMarketSummation();
    this.ds.balanceInfo$.subscribe(data => {
      this.balanceInfo = data;
    });
    //console.log(this.details);
    //console.log(this.selectedItem);
    this.ds.event$.subscribe(event => {
      this.eventData = event;
      //console.log(this.eventData)
    });
    this.getIP();
  }

  getMaxMarketSummation() {
    this.apiService.ApiCall({ market_type: this.details.market_type }, environment.apiUrl + 'getMaxMarketSummation', 'post').subscribe(
      result => {
        if (result.success) {
          this.sum_of_max_market = result != null ? result : 0;
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
      data: { description: this.eventDeatils.event.name, runner_name: this.details.runnerName, selectionType: this.selectedItem.type, odds: this.inputData, stake: this.stakeValue, p_and_l: this.calculatedValue }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loader();
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
    if (this.stakeValue == undefined) this.stakeValue = 0;
    if (this.stakeValue.toString() != '')
      this.stakeValue = parseFloat(this.stakeValue.toString()) + parseFloat(value);
    else
      this.stakeValue = parseFloat(value);
    this.calculateValue();
  }

  calculateValue() {
    if (this.selectedItem.type === 'yes') {
      this.calculatedValue = parseFloat(this.selectedItem.BackPrice1) / 100 * this.stakeValue; //parseFloat((this.inputData - 1).toString()) * parseFloat(this.stakeValue.toString())).toFixed(2);
      this.returnExposure.loss = -Math.abs(this.stakeValue);
      this.returnExposure.profit = this.calculatedValue;
    } else {
      this.calculatedValue = parseFloat(this.selectedItem.BackPrice1) / 100 * this.stakeValue;
      this.returnExposure.loss = -Math.abs(this.calculatedValue);
      this.returnExposure.profit = this.stakeValue;
    }
    if (this.stakeValue.toString() == '') {
      this.calculatedValue = 0.00;
    } else {
      this.returnExposure.index = this.details.index;
      this.profit_and_liability.emit(this.returnExposure);
    }
    let tempPrevioutBet = [];
    tempPrevioutBet = [...this.previousBet];
    let price = this.selectedItem.type == 'yes' ? this.selectedItem.BackPrice1 : this.selectedItem.LayPrice1;
    tempPrevioutBet.push({ placed_odd: parseInt(this.selectedItem.value), price: parseInt(price), stake: this.stakeValue, odd: this.selectedItem.type == 'yes' ? 0 : 1 })
    tempPrevioutBet.sort(this.GetSortOrder("placed_odd"));
    this.calculateLader(tempPrevioutBet);
  }

  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }

  betPlace() {
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

  loader() {
    let EnentList = ["Cricket", "Tennis", "Football", "Soccer"];
    let loaderTime;
    if (EnentList.indexOf(this.eventData.name) !== -1)
      loaderTime = 1000;
    else
      loaderTime = 1000;
    this._loadingService.show();
    this.canceBet();
    setTimeout(() => {
      this.insertBet();
      this._loadingService.hide();
    }, loaderTime);
  }

  calculateLader(tempPrevioutBet) {
    if (tempPrevioutBet.length > 0) {
      console.log(tempPrevioutBet)
      let ladderTable: any = [];
      for (let i = 0; i < tempPrevioutBet.length; i++) {
        if (i == 0) {
          ladderTable.push({ from: 0, to: tempPrevioutBet[i].placed_odd - 1 })
        } else {
          ladderTable.push({ from: tempPrevioutBet[i - 1].placed_odd, to: tempPrevioutBet[i].placed_odd - 1 })
        }
      }
      ladderTable.push({ from: tempPrevioutBet[tempPrevioutBet.length - 1].placed_odd, to: tempPrevioutBet[tempPrevioutBet.length - 1].placed_odd });
      for (let i = 0; i < tempPrevioutBet.length; i++) {
        for (let j = 0; j < ladderTable.length; j++) {
          if (tempPrevioutBet[i].odd == 0) {
            if (ladderTable[j].to >= tempPrevioutBet[i].placed_odd) {
              ladderTable[j][i] = tempPrevioutBet[i].price / 100 * tempPrevioutBet[i].stake;
            }
            else {
              ladderTable[j][i] = -Math.abs(tempPrevioutBet[i].stake);
            }
          }
          else {
            if (ladderTable[j].to < tempPrevioutBet[i].placed_odd) {
              ladderTable[j][i] = tempPrevioutBet[i].price / 100 * tempPrevioutBet[i].stake;
            }
            else {
              ladderTable[j][i] = -Math.abs(tempPrevioutBet[i].stake);
            }
          }
        }
      }
      let all_amount: any = [];
      for (let i = 0; i < ladderTable.length; i++) {
        for (let j = 0; j < tempPrevioutBet.length; j++) {
          if (j == 0) {
            ladderTable[i]["result"] = ladderTable[i][j];
          } else {
            ladderTable[i]["result"] += ladderTable[i][j];
            all_amount[i] = ladderTable[i]["result"];
          }
        }
      }
      this.minValueOfFancy = this.min(all_amount);
      //console.log(ladderTable,this.minValueOfFancy);
    }
  }

  insertBet() {
    let net_exposure = 0;
    let total_balance = this.balanceInfo.net_exposure + this.balanceInfo.available_balance;
    let tempPrevioutBet2 = [...this.previousBet];
    tempPrevioutBet2.sort(this.GetSortOrder("single_bet_id"));
    //console.log("previous fancy exposure",tempPrevioutBet2[tempPrevioutBet2.length-1].all_teams_exposure_data);
    let previous_fancy_exposure = tempPrevioutBet2[tempPrevioutBet2.length - 1].all_teams_exposure_data == undefined ? 0 : tempPrevioutBet2[tempPrevioutBet2.length - 1].all_teams_exposure_data;
    let current_exposure = 0;
    current_exposure = Math.abs(this.minValueOfFancy) - Math.abs(previous_fancy_exposure);
    net_exposure = this.balanceInfo.net_exposure + current_exposure;
    //console.log('net exposure', fancy_exposure, total_balance, this.balanceInfo.balance_limit);
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
      let param = {
        market_id: this.details.marketId,
        match_id: this.eventDeatils.event.id,
        market_type: this.details.market_type,
        description: this.eventDeatils.event.name,
        event_name: this.eventData.name,
        event_id: this.eventData.eventType,
        odd: this.selectedItem.type == 'yes' ? 0 : 1,
        place_odd: this.inputData,
        last_odd: this.inputData,
        stake: this.stakeValue,
        runner_name: this.details.runnerName,
        runners: 0,
        market_start_time: 0,
        market_end_time: 0,
        user_ip: this.ipAddress,
        selection_id: this.selectedItem.SelectionId,
        user_id: this.details.user_id,
        p_and_l: 0,
        bet_status: 0,
        market_status: 0,
        bet_id: "111",
        settled_time: 0,
        master_id: this.details.punter_belongs_to,
        current_exposure: current_exposure,
        minValueOfFancy: this.minValueOfFancy,
        amount: 0,
        liability: Math.abs(this.returnExposure.loss),
        profit: Math.abs(this.returnExposure.profit),
        price: this.selectedItem.type == 'yes' ? this.selectedItem.BackPrice1 : this.selectedItem.LayPrice1
      };
      console.log(param);
      this.apiService.ApiCall(param, environment.apiUrl + 'single-place-bet-for-fancy', 'post').subscribe(
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
  }

  min(input) {
    if (toString.call(input) !== "[object Array]")
      return false;
    return Math.min.apply(null, input);
  }

}
