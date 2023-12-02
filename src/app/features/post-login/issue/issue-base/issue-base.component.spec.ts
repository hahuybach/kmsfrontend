import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueBaseComponent } from './issue-base.component';

describe('IssueBaseComponent', () => {
  let component: IssueBaseComponent;
  let fixture: ComponentFixture<IssueBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueBaseComponent]
    });
    fixture = TestBed.createComponent(IssueBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
