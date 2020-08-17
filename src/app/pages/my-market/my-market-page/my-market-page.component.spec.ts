import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMarketPageComponent } from './my-market-page.component';

describe('MyMarketPageComponent', () => {
  let component: MyMarketPageComponent;
  let fixture: ComponentFixture<MyMarketPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMarketPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMarketPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
