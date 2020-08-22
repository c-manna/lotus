import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyBetFormComponent } from './fancy-bet-form.component';

describe('FancyBetFormComponent', () => {
  let component: FancyBetFormComponent;
  let fixture: ComponentFixture<FancyBetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FancyBetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyBetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
