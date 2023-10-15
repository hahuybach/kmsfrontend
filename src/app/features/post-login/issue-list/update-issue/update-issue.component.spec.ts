import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIssueComponent } from './update-issue.component';

describe('UpdateIssueComponent', () => {
  let component: UpdateIssueComponent;
  let fixture: ComponentFixture<UpdateIssueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateIssueComponent]
    });
    fixture = TestBed.createComponent(UpdateIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
