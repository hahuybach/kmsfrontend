import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionDocumentComponent } from './inspection-document.component';

describe('InspectionDocumentComponent', () => {
  let component: InspectionDocumentComponent;
  let fixture: ComponentFixture<InspectionDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectionDocumentComponent]
    });
    fixture = TestBed.createComponent(InspectionDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
