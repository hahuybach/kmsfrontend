import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueListPopUpComponent } from './issue-list-pop-up.component';

describe('IssueListPopUpComponent', () => {
  let component: IssueListPopUpComponent;
  let fixture: ComponentFixture<IssueListPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueListPopUpComponent]
    });
    fixture = TestBed.createComponent(IssueListPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
