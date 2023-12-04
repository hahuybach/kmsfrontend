import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidanceDocumentCreateComponent } from './guidance-document-create.component';

describe('GuidanceDocumentCreateComponent', () => {
  let component: GuidanceDocumentCreateComponent;
  let fixture: ComponentFixture<GuidanceDocumentCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuidanceDocumentCreateComponent]
    });
    fixture = TestBed.createComponent(GuidanceDocumentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
