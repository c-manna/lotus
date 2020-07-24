import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingProfitAndLossComponent } from './betting-profit-and-loss.component';

describe('BettingProfitAndLossComponent', () => {
  let component: BettingProfitAndLossComponent;
  let fixture: ComponentFixture<BettingProfitAndLossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BettingProfitAndLossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingProfitAndLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
