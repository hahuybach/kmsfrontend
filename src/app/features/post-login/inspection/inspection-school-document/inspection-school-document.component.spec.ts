import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionSchoolDocumentComponent } from './inspection-school-document.component';

describe('InspectionSchoolDocumentComponent', () => {
  let component: InspectionSchoolDocumentComponent;
  let fixture: ComponentFixture<InspectionSchoolDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionSchoolDocumentComponent]
    });
    fixture = TestBed.createComponent(InspectionSchoolDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
