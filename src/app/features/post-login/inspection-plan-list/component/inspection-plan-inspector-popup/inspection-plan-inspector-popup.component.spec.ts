import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionPlanInspectorPopupComponent } from './inspection-plan-inspector-popup.component';

describe('InspectionPlanInspectorPopupComponent', () => {
  let component: InspectionPlanInspectorPopupComponent;
  let fixture: ComponentFixture<InspectionPlanInspectorPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionPlanInspectorPopupComponent]
    });
    fixture = TestBed.createComponent(InspectionPlanInspectorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
