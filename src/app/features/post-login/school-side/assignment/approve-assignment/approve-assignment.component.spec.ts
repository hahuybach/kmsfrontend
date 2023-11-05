import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveAssignmentComponent } from './approve-assignment.component';

describe('ApproveAssignmentComponent', () => {
  let component: ApproveAssignmentComponent;
  let fixture: ComponentFixture<ApproveAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApproveAssignmentComponent]
    });
    fixture = TestBed.createComponent(ApproveAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
