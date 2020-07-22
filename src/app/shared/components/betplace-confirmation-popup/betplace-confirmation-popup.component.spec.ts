import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetplaceConfirmationPopupComponent } from './betplace-confirmation-popup.component';

describe('BetplaceConfirmationPopupComponent', () => {
  let component: BetplaceConfirmationPopupComponent;
  let fixture: ComponentFixture<BetplaceConfirmationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetplaceConfirmationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetplaceConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
