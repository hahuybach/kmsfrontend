import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { switchMap } from 'rxjs';
import { AssignmentService } from 'src/app/services/assignment.service';
import { IssueService } from 'src/app/services/issue.service';

@Component({
  selector: 'app-approve-assignment',
  templateUrl: './approve-assignment.component.html',
  styleUrls: ['./approve-assignment.component.scss'],
})
export class ApproveAssignmentComponent implements OnInit {
  assignments: any[];
  selectedAssignment: any;
  assVisible = false;
  newAssigneeName: string;
  documents: any[] = [];
  assignmentForm: FormGroup;
  issueId: number;
  statusForm: FormGroup;
  commentForm = this.fb.group({
    content: ['', Validators.required],
    userName: ['', Validators.required],
    createdDate: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private issueService: IssueService
  ) {}
  ngOnInit(): void {
    this.assignments = [
      {
        assignmentId: 1,
        assignmentName: 'Assignment 1',
        assigner: {
          accountId: 0,
          email: 'string',
          user: {
            userId: 0,
            fullName: 'Nguyễn Văn A',
            dob: '2023-11-09',
            gender: 'MALE',
            phoneNumber: 'string',
          },
          school: {
            schoolId: 0,
            schoolName: 'string',
            exactAddress: 'string',
            isActive: true,
          },
          roles: [
            {
              roleId: 0,
              roleName: 'string',
              isSchoolEmployee: true,
            },
          ],
        },
        assignee: {
          accountId: 0,
          email: 'string',
          user: {
            userId: 0,
            fullName: 'Nguyễn Văn B',
            dob: '2023-11-09',
            gender: 'MALE',
            phoneNumber: 'string',
          },
          school: {
            schoolId: 0,
            schoolName: 'string',
            exactAddress: 'string',
            isActive: true,
          },
          roles: [
            {
              roleId: 0,
              roleName: 'string',
              isSchoolEmployee: true,
            },
          ],
        },
        listOfPossibleAssginees: [
          {
            accountId: 0,
            email: 'string',
            user: {
              userId: 0,
              fullName: 'string',
              dob: '2023-11-09',
              gender: 'MALE',
              phoneNumber: 'string',
            },
            school: {
              schoolId: 0,
              schoolName: 'string',
              exactAddress: 'string',
              isActive: true,
            },
            roles: [
              {
                roleId: 0,
                roleName: 'string',
                isSchoolEmployee: true,
              },
            ],
          },
        ],
        deadline: '2023-11-09T16:08:16.567Z',
        createdDate: '2023-11-09T16:08:16.567Z',
        issueId: 0,
        description:
          'Bạn có thể hoàn tác và làm lại tối đa 20 trong số các hành động nhập liệu hoặc thiết kế cuối cùng của bạn trong Access. Để hoàn tác một hành động, hãy nhấn Ctrl + Z',
        status: {
          statusId: 16,
          statusName: 'Chưa phê duyệt',
          statusType: 'string',
        },
        parentId: 0,
        progress: 0,
        task: true,
      },
    ];
    this.assignmentForm = this.fb.group({
      status: ['', Validators.required],
    });
  }

  initData() {
    this.issueService
      .getCurrentActiveIssue()
      .pipe(
        switchMap((data) => {
          console.log(data);
          this.issueId = data.issueDto.issueId;
          return this.assignmentService.getAssignmentsToApprove(
            data.issueDto.issueId
          );
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.assignments = [data];
        console.log(this.assignments);
      });
  }
  statusOptions = [
    {
      label: 'Chờ phê duyệt',
      value: 'Chờ phê duyệt',
      severity: 'warning',
      disabled: true,
    },
    {
      label: 'Phê duyệt',
      value: 'Phê duyệt',
      severity: 'success',
      disabled: false,
    },
    {
      label: 'Không phê duyệt',
      value: 'Không phê duyệt',
      severity: 'danger',
      disabled: false,
    },
  ];

  assVisibleToggle(assignment: any) {
    this.assVisible = true;
    console.log(assignment);
    this.selectedAssignment = assignment;
    this.assignmentForm
      .get('status')
      ?.setValue(this.selectedAssignment.status.statusName);
  }
  onRowEditSave(i: number) {
    console.log('save ' + i);
  }
  onRowEditCancel(i: number) {
    console.log('cancel ' + i);
  }
  onRowEditInit(i: number) {
    console.log('init ' + i);
    this.assignmentForm.get('status')?.setValue('đang làm');
  }
  sendComment() {
    console.log(this.commentForm.get('content')?.value);
    this.selectedAssignment.comments.unshift({
      content: this.commentForm.get('content')?.value,
      userName: 'tran le hai',
      createdDate: new Date(),
    });
    this.commentForm.reset();
  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendComment();
    }
  }
  getStatusSeverity(statusId: number): string {
    const statusSeverityMap: { [key: number]: string } = {
      16: 'warning',
      17: 'success',
      18: 'danger',
    };

    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }
}
