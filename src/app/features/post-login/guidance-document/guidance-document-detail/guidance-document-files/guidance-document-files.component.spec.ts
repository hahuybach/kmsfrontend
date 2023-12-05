import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidanceDocumentFilesComponent } from './guidance-document-files.component';

describe('GuidanceDocumentFilesComponent', () => {
  let component: GuidanceDocumentFilesComponent;
  let fixture: ComponentFixture<GuidanceDocumentFilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuidanceDocumentFilesComponent]
    });
    fixture = TestBed.createComponent(GuidanceDocumentFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
