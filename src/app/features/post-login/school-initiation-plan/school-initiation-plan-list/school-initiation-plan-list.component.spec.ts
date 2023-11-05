import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolInitiationPlanListComponent } from './school-initiation-plan-list.component';

describe('SchoolInitiationPlanListComponent', () => {
  let component: SchoolInitiationPlanListComponent;
  let fixture: ComponentFixture<SchoolInitiationPlanListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolInitiationPlanListComponent]
    });
    fixture = TestBed.createComponent(SchoolInitiationPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
