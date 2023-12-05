import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionPlanBaseComponent } from './inspection-plan-base.component';

describe('InspectionPlanBaseComponent', () => {
  let component: InspectionPlanBaseComponent;
  let fixture: ComponentFixture<InspectionPlanBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionPlanBaseComponent]
    });
    fixture = TestBed.createComponent(InspectionPlanBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
