import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleAndRegulationComponent } from './rule-and-regulation.component';

describe('RuleAndRegulationComponent', () => {
  let component: RuleAndRegulationComponent;
  let fixture: ComponentFixture<RuleAndRegulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleAndRegulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleAndRegulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
