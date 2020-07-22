import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetPlaceFromComponent } from './bet-place-from.component';

describe('BetPlaceFromComponent', () => {
  let component: BetPlaceFromComponent;
  let fixture: ComponentFixture<BetPlaceFromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetPlaceFromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetPlaceFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
