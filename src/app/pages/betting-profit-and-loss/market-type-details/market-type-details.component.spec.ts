import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTypeDetailsComponent } from './market-type-details.component';

describe('MarketTypeDetailsComponent', () => {
  let component: MarketTypeDetailsComponent;
  let fixture: ComponentFixture<MarketTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
