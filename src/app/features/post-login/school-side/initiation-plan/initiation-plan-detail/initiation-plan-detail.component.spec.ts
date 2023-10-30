import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiationPlanDetailComponent } from './initiation-plan-detail.component';

describe('InitiationPlanDetailComponent', () => {
  let component: InitiationPlanDetailComponent;
  let fixture: ComponentFixture<InitiationPlanDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitiationPlanDetailComponent]
    });
    fixture = TestBed.createComponent(InitiationPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
