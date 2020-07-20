import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTabComponent } from './live-tab.component';

describe('LiveTabComponent', () => {
  let component: LiveTabComponent;
  let fixture: ComponentFixture<LiveTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
