import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-bet-place-from',
  templateUrl: './bet-place-from.component.html',
  styleUrls: ['./bet-place-from.component.scss']
})
export class BetPlaceFromComponent implements OnInit {
  @Output() betCancelled: any = new EventEmitter();
  viewMode = '';

  constructor() { }

  ngOnInit(): void {
  }

  canceBet() {
    this.betCancelled.emit();
  }

}
