import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidanceDocumentListComponent } from './guidance-document-list.component';

describe('GuidanceDocumentListComponent', () => {
  let component: GuidanceDocumentListComponent;
  let fixture: ComponentFixture<GuidanceDocumentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuidanceDocumentListComponent]
    });
    fixture = TestBed.createComponent(GuidanceDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
