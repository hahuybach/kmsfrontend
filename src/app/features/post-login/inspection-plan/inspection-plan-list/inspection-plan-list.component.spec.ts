import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionPlanListComponent } from './inspection-plan-list.component';

describe('InspectionPlanListComponent', () => {
  let component: InspectionPlanListComponent;
  let fixture: ComponentFixture<InspectionPlanListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionPlanListComponent]
    });
    fixture = TestBed.createComponent(InspectionPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
