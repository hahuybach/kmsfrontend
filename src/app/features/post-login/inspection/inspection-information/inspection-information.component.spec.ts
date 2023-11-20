import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionInformationComponent } from './inspection-information.component';

describe('InspectionInformationComponent', () => {
  let component: InspectionInformationComponent;
  let fixture: ComponentFixture<InspectionInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionInformationComponent]
    });
    fixture = TestBed.createComponent(InspectionInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
