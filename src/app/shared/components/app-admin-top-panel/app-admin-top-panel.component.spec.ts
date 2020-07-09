import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAdminTopPanelComponent } from './app-admin-top-panel.component';

describe('AppAdminTopPanelComponent', () => {
  let component: AppAdminTopPanelComponent;
  let fixture: ComponentFixture<AppAdminTopPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAdminTopPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAdminTopPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
