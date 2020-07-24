import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferStatementComponent } from './transfer-statement.component';

describe('TransferStatementComponent', () => {
  let component: TransferStatementComponent;
  let fixture: ComponentFixture<TransferStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
