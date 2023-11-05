import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitAssignmentComponent } from './submit-assignment.component';

describe('SubmitAssignmentComponent', () => {
  let component: SubmitAssignmentComponent;
  let fixture: ComponentFixture<SubmitAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitAssignmentComponent]
    });
    fixture = TestBed.createComponent(SubmitAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
