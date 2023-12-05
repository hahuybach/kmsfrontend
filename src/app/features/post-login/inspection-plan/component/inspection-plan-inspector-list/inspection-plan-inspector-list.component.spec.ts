import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionPlanInspectorListComponent } from './inspection-plan-inspector-list.component';

describe('InspectionPlanInspectorListComponent', () => {
  let component: InspectionPlanInspectorListComponent;
  let fixture: ComponentFixture<InspectionPlanInspectorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionPlanInspectorListComponent]
    });
    fixture = TestBed.createComponent(InspectionPlanInspectorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
