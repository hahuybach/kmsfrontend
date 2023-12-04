import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidanceDocumentDetailComponent } from './guidance-document-detail.component';

describe('GuidanceDocumentDetailComponent', () => {
  let component: GuidanceDocumentDetailComponent;
  let fixture: ComponentFixture<GuidanceDocumentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuidanceDocumentDetailComponent]
    });
    fixture = TestBed.createComponent(GuidanceDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
