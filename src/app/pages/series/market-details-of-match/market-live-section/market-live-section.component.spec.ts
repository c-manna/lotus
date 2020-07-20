import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLiveSectionComponent } from './market-live-section.component';

describe('MarketLiveSectionComponent', () => {
  let component: MarketLiveSectionComponent;
  let fixture: ComponentFixture<MarketLiveSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketLiveSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketLiveSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
