import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInspectionPlanComponent } from './create-inspection-plan.component';

describe('CreateInspectionPlanComponent', () => {
  let component: CreateInspectionPlanComponent;
  let fixture: ComponentFixture<CreateInspectionPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateInspectionPlanComponent]
    });
    fixture = TestBed.createComponent(CreateInspectionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
