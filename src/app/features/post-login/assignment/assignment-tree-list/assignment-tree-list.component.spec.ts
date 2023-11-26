import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentTreeListComponent } from './assignment-tree-list.component';

describe('AssignmentTreeListComponent', () => {
  let component: AssignmentTreeListComponent;
  let fixture: ComponentFixture<AssignmentTreeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignmentTreeListComponent]
    });
    fixture = TestBed.createComponent(AssignmentTreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
