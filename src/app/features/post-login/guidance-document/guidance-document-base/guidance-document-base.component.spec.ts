import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidanceDocumentBaseComponent } from './guidance-document-base.component';

describe('GuidanceDocumentBaseComponent', () => {
  let component: GuidanceDocumentBaseComponent;
  let fixture: ComponentFixture<GuidanceDocumentBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuidanceDocumentBaseComponent]
    });
    fixture = TestBed.createComponent(GuidanceDocumentBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
