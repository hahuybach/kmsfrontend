import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionMytaskComponent } from './inspection-mytask.component';

describe('InspectionMytaskComponent', () => {
  let component: InspectionMytaskComponent;
  let fixture: ComponentFixture<InspectionMytaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionMytaskComponent]
    });
    fixture = TestBed.createComponent(InspectionMytaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
