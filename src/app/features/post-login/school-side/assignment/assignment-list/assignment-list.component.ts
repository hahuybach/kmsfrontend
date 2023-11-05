import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss'],
})
export class AssignmentListComponent implements OnInit {
  assignments: any[];
  assVisible = true;
  assigneelist: any[];
  ngOnInit(): void {
    this.assignments = [
      {
        assignmentId: 1,
        assignmentName: 'assignment name 1',
        assignee: {},
        assigner: {},
      },
    ];
    this.assigneelist = [
      {
        assigneeId: 1,
        assigneeName: 'bach',
      },
      {
        assigneeId: 2,
        assigneeName: 'an',
      },
    ];
  }
}
