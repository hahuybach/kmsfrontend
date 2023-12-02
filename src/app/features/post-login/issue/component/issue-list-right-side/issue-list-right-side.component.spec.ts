import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueListRightSideComponent } from './issue-list-right-side.component';

describe('IssueListRightSideComponent', () => {
  let component: IssueListRightSideComponent;
  let fixture: ComponentFixture<IssueListRightSideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueListRightSideComponent]
    });
    fixture = TestBed.createComponent(IssueListRightSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
