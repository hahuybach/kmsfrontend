import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionPlanDetailComponent } from './inspection-plan-detail.component';

describe('InspectionPlanDetailComponent', () => {
  let component: InspectionPlanDetailComponent;
  let fixture: ComponentFixture<InspectionPlanDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionPlanDetailComponent]
    });
    fixture = TestBed.createComponent(InspectionPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
