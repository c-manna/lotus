import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRightsidePanelComponent } from './admin-rightside-panel.component';

describe('AdminRightsidePanelComponent', () => {
  let component: AdminRightsidePanelComponent;
  let fixture: ComponentFixture<AdminRightsidePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRightsidePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRightsidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
