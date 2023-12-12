import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueInspectorPopupComponent } from './issue-inspector-popup.component';

describe('IssueInspectorPopupComponent', () => {
  let component: IssueInspectorPopupComponent;
  let fixture: ComponentFixture<IssueInspectorPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueInspectorPopupComponent]
    });
    fixture = TestBed.createComponent(IssueInspectorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
