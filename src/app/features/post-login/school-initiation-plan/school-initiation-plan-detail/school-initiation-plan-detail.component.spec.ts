import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolInitiationPlanDetailComponent } from './school-initiation-plan-detail.component';

describe('SchoolInitiationPlanDetailComponent', () => {
  let component: SchoolInitiationPlanDetailComponent;
  let fixture: ComponentFixture<SchoolInitiationPlanDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolInitiationPlanDetailComponent]
    });
    fixture = TestBed.createComponent(SchoolInitiationPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
