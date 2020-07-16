import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDetailsOfMatchComponent } from './market-details-of-match.component';

describe('MarketDetailsOfMatchComponent', () => {
  let component: MarketDetailsOfMatchComponent;
  let fixture: ComponentFixture<MarketDetailsOfMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketDetailsOfMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketDetailsOfMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
