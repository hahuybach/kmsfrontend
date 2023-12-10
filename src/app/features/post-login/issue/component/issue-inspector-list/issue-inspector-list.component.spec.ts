import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueInspectorListComponent } from './issue-inspector-list.component';

describe('IssueInspectorListComponent', () => {
  let component: IssueInspectorListComponent;
  let fixture: ComponentFixture<IssueInspectorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueInspectorListComponent]
    });
    fixture = TestBed.createComponent(IssueInspectorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
