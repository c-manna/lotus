import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFooterPanelComponent } from './admin-footer-panel.component';

describe('AdminFooterPanelComponent', () => {
  let component: AdminFooterPanelComponent;
  let fixture: ComponentFixture<AdminFooterPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFooterPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFooterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
