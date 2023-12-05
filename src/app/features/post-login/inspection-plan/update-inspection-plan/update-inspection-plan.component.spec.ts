import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInspectionPlanComponent } from './update-inspection-plan.component';

describe('UpdateInspectionPlanComponent', () => {
  let component: UpdateInspectionPlanComponent;
  let fixture: ComponentFixture<UpdateInspectionPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateInspectionPlanComponent]
    });
    fixture = TestBed.createComponent(UpdateInspectionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
