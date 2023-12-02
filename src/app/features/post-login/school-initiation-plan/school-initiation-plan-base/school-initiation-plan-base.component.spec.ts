import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolInitiationPlanBaseComponent } from './school-initiation-plan-base.component';

describe('SchoolInitiationPlanBaseComponent', () => {
  let component: SchoolInitiationPlanBaseComponent;
  let fixture: ComponentFixture<SchoolInitiationPlanBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolInitiationPlanBaseComponent]
    });
    fixture = TestBed.createComponent(SchoolInitiationPlanBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
