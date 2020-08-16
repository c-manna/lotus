import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { APIService } from '@app/shared/services/api.service';
import { LoadingService, SnakebarService } from '@app/shared/services/common.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-transfer-statement',
  templateUrl: './transfer-statement.component.html',
  styleUrls: ['./transfer-statement.component.scss']
})
export class TransferStatementComponent implements OnInit {
  filterForm: FormGroup;
  dataList: any = [];
  submit: boolean = false;
  newList: any = [];
  userData: any = {};
  dataCount: any = 0;
  selectedRemark: any;
  remarkOptions = [
    { name: "All" },
    { name: "Credit balance received", filter: { balance_statement: true, type: "credit" } },
    { name: "Credit loss payment", filter: { transfer_statement: true, p_and_l: 1 } },
    { name: "Winning settlement", filter: { transfer_statement: true, p_and_l: 0, punter_balance_type: "Advanced Deposit" } },
    { name: "Advance balance receive", filter: { punter_balance_type: "Advanced Deposit", balance_statement: true, transfer_statement: true, p_and_l: 1, user_type: "advance" } },
    { name: "Balance withdrawl", filter: { balance_statement: true, type: "debit" } },
    { name: "Event name", filter: { single_bet_info: true, market_status: true, p_and_l: true } }]
  constructor(
    private _fb: FormBuilder,
    private _apiService: APIService,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService
  ) { }

  get f() {
    return this.filterForm.controls;
  }

  ngOnInit(): void {
    this.createFilterForm();
    this.getPunterCommision();
  }

  createFilterForm() {
    this.filterForm = this._fb.group({
      startDate: [""],
      endDate: [""],
      selectedOption: [""],
      page: ["1"],
      limit: ["25"],
      searchText: [""]
    });
  }

  getPunterCommision() {
    this._loadingService.show();
    this._apiService.ApiCall({}, environment.apiUrl + 'user-details', 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.userData = result['data'];
          this.getTransferData('');
          console.log(this.filterForm.controls);
        }
      }, err => {
        this._loadingService.hide();
      });
  }

  formSubmit() {
    console.log("formSubmit==", this.filterForm.value);
    const data = this.filterForm.value;
    this.submit = true;
    if (!this.filterForm.valid) return;
    let query = '?';
    if (data.startDate) query = query + '&startDate=' + new Date(data.startDate).getTime();
    if (data.endDate) query = query + '&endDate=' + new Date(data.endDate).getTime();
    if (data.selectedOption) query = query + 'selectedOption=' + data.selectedOption;
    if (data.limit) query = query + '&limit=' + data.limit;
    if (data.page) query = query + '&page=' + data.page;
    if (data.searchText) query = query + '&searchText=' + data.searchText;
    if (query != '?') {
      this.submit = false;
      this.getTransferData(query);
    }
  }

  submitButton() {
    this.filterForm.controls.page.setValue(1);
    this.formSubmit();
  }

  getTransferData(query) {
    this._loadingService.show();
    this._apiService.ApiCall(this.selectedRemark, environment.apiUrl + 'transfer-statment' + query, 'post').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.dataList = result['data'];
          this.dataCount = result['count'];
          this.newList = [];
          this.dataList.forEach(item => {
            const newItem = {};
            if (item.type) {
              if (item.type == "credit") {
                newItem['credit'] = item.amount;
                if (this.userData.punter_balance_type == "Advanced Deposit") newItem['remark'] = "Advance balance receive";
                else newItem['remark'] = "Credit balance received";
              }
              else {
                newItem['debit'] = item.amount;
                newItem['remark'] = "Balance withdrawl";
              }
            } else if (item.hasOwnProperty('p_and_l') && item.hasOwnProperty('market_status')) {
              if (item.p_and_l == 0) newItem['credit'] = item.amount;
              else newItem['debit'] = item.amount;
              newItem['remark'] = item["description"];
            } else if (item.hasOwnProperty('p_and_l')) {
              if (item.p_and_l == 0) {
                newItem['credit'] = item.amount;
                newItem['remark'] = "Winning settlement";
              }
              else {
                newItem['debit'] = item.amount;
                if (this.userData.punter_balance_type == "Advanced Deposit") newItem['remark'] = "advance balance receive";
                else newItem['remark'] = "Credit loss payment";
              }
            }
            newItem['date'] = item.date;
            this.newList.push(newItem);
          });
        }
      }, err => {
        this._loadingService.hide();
      });
  }

  calculateBalance(debit, credit) {
    return eval(this.userData.punter_balance) + eval(((credit) ? credit : 0)) - eval(((debit) ? debit : 0));
  }

  paginationChange(e) {
    console.log(e);
    this.filterForm.controls.limit.setValue(e.target.value);
    this.formSubmit();
  }

  paginationPageChange(e) {
    console.log(e);
    this.filterForm.controls.page.setValue(e.pageIndex + 1);
    this.formSubmit();
  }

  remarkChange(e) {
    console.log(e);
    this.selectedRemark = this.remarkOptions[e.target.value];
    console.log(this.selectedRemark);
  }

}
