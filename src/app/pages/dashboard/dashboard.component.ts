import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { SnakebarService, LoadingService } from '@app/shared/services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '@app/shared/services/socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  createBetFormActive: any;
  constructor(
    private _snakebarService: SnakebarService,
    private _loadingService: LoadingService,
    private _cookieService: CookieService,
    private _socketService: SocketService
  ) { }
  selectedItem: any = {};
  dataList = [{
    id: 1,
    status: true,
    name1: "India",
    name2: "England",
    item: [{ back: 1.1, lay: 1.2 }, { back: 1.3, lay: 1.4 }, { back: 1.5, lay: 1.6 }]
  }, {
    id: 2,
    status: true,
    name1: "RSA",
    name2: "England",
    item: [{ back: 2.1 }, { back: 2.3, lay: 2.4 }, {}]
  }, {
    id: 3,
    status: false,
    name1: "India",
    name2: "RSA",
    item: [{ back: 3.1, lay: 3.2 }, { back: 3.3, lay: 3.4 }, { back: 3.5, lay: 3.6 }]
  }]

  ngOnInit(): void {
    this._socketService.getBalance("2750231N007");
    console.log(JSON.parse(this._cookieService.get("user")));
    // this._snakebarService.show("success", "hi");
  }

  canceBet() {
    console.log("canceBet");
    this.createBetFormActive = 0;
  }

  openCreateBetForm(viewMode, value, type, item, eachItem) {
    let currentTime = Date.now();
    this.selectedItem = { type: type, ...item, value: value };
    eachItem['viewMode'] = viewMode;
    item['createBetFormActive'] = currentTime;
    eachItem['createBetFormActive'] = currentTime;
    this.createBetFormActive = currentTime;
  }

}
