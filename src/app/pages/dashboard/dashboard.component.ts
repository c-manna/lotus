import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  createBetFormActive: boolean = false;
  constructor() { }
  viewMode = '';
  selectedItem: any = {};
  dataList = [{
    id: 1,
    name1: "India",
    name2: "England",
    item: [{ back: 1.1, lay: 1.2 }, { back: 1.3, lay: 1.4 }, { back: 1.5, lay: 1.6 }]
  }, {
    id: 2,
    name1: "RSA",
    name2: "England",
    item: [{ back: 2.1, lay: 2.2 }, { back: 2.3, lay: 2.4 }, { back: 2.5, lay: 2.6 }]
  }, {
    id: 3,
    name1: "India",
    name2: "RSA",
    item: [{ back: 3.1, lay: 3.2 }, { back: 3.3, lay: 3.4 }, { back: 3.5, lay: 3.6 }]
  }]

  ngOnInit(): void {
  }

  canceBet() {
    console.log("canceBet");
    this.createBetFormActive = false;
    this.viewMode = '';
  }

  openCreateBetForm(viewMode, index, type, value) {
    this.createBetFormActive = false;
    this.dataList.forEach((item) => {
      if (item['viewMode']) item['viewMode'] = false;
      if (item['createBetFormActive']) item['createBetFormActive'] = false;
    });
    this.selectedItem = { type: type, ...value };
    this.dataList[index]['viewMode'] = viewMode;
    this.dataList[index]['createBetFormActive'] = true;
    this.createBetFormActive = true;
  }

}
