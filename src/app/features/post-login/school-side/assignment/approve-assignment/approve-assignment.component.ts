import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-approve-assignment',
  templateUrl: './approve-assignment.component.html',
  styleUrls: ['./approve-assignment.component.scss'],
})
export class ApproveAssignmentComponent implements OnInit {
  assignments: any[] = [];
  selectedAssignment: any;
  assVisible = false;
  newAssigneeName: string;
  ngOnInit(): void {
    this.assignments = [
      {
        assignmentId: 1,
        assignmentName: 'assignment name 1',
        description: 'des 1',
        assignee: {
          assigneeId: 1,
          assigneeName: 'bach',
        },
        assigner: {
          assignerId: 2,
          assignerName: 'Nguyễn Văn A',
        },
        deadline: '10/11/2002',
        comments: [
          {
            userName: 'Hà Huy Bách',
            content: 'Em làm lại đi nhé',
            createdDate: '2023-11-06T12:00:00',
          },
        ],
        status: '',
      },
    ];
  }
  statusOptions: SelectItem[] = [
    { label: 'Phê duyệt', value: 'Phê duyệt' },
    { label: 'Không phê duyệt', value: 'Không phê duyệt' },
    // Add more options as needed
  ];

  assVisibleToggle(assignment: any) {
    this.assVisible = true;
    console.log(assignment);
    this.selectedAssignment = assignment;
  }
  onRowEditSave(i: number) {
    console.log('save ' + i);
  }
  onRowEditCancel(i: number) {
    console.log('cancel ' + i);
  }
  onRowEditInit(i: number) {
    console.log('init ' + i);
  }
}
