import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBetsTabComponent } from './open-bets-tab.component';

describe('OpenBetsTabComponent', () => {
  let component: OpenBetsTabComponent;
  let fixture: ComponentFixture<OpenBetsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenBetsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenBetsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
