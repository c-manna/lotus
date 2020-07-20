import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-open-bets-tab',
  templateUrl: './open-bets-tab.component.html',
  styleUrls: ['./open-bets-tab.component.scss']
})
export class OpenBetsTabComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
