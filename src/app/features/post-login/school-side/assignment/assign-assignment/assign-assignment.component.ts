import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { AssignmentService } from 'src/app/services/assignment.service';
import { IssueService } from 'src/app/services/issue.service';

@Component({
  selector: 'app-assign-assignment',
  templateUrl: './assign-assignment.component.html',
  styleUrls: ['./assign-assignment.component.scss'],
})
export class AssignAssignmentComponent implements OnInit {
  issueId: number;
  assignments: any[];
  assignmentVisible = false;
  selectedAssignment: any;
  action: string | undefined;
  assignmentForm = this.fb.group({
    assignmentName: ['', Validators.required],
    description: ['', Validators.required],
    deadline: ['', Validators.required],
    parentId: ['', Validators.required],
  });
  typeAssignmentOptions: any[] = [];
  listOfPossibleAssginees: any[] = [];
  ngOnInit(): void {
    // this.assignmentService.getAssignmentsToSubmit(1).subscribe((data) => {
    //   console.log(data);
    // });
    this.typeAssignmentOptions = [
      { label: 'Thư mục', value: true },
      { label: 'Nộp tài liệu', value: false },
    ];
    this.issueService
      .getCurrentActiveIssue()
      .pipe(
        switchMap((data) => {
          console.log(data);
          this.issueId = data.issueDto.issueId;

          return this.assignmentService.getAssignmentsToAssign(
            data.issueDto.issueId
          );
        })
      )
      .subscribe((data) => {
        console.log('Đống data lấy về');
        this.assignments = data.assignmentListDtos;
        console.log(this.assignments);
      });
  }
  constructor(
    private assignmentService: AssignmentService,
    private issueService: IssueService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  initData() {
    this.issueService
      .getCurrentActiveIssue()
      .pipe(
        switchMap((data) => {
          console.log(data);
          this.issueId = data.issueDto.issueId;

          return this.assignmentService.getAssignmentsToAssign(
            data.issueDto.issueId
          );
        })
      )
      .subscribe((data) => {
        console.log('Đống data lấy về');
        this.assignments = data.assignmentListDtos;
        console.log(this.assignments);
      });
  }
  openDetail(assignment?: any, action?: string) {
    this.assignmentVisible = true;
    this.selectedAssignment = assignment;
    this.listOfPossibleAssginees = assignment.listOfPossibleAssginees;
    console.log(this.listOfPossibleAssginees);
    this.action = action;
    switch (action) {
      case 'addchild': {
        console.log('run here');
        this.assignmentForm
          .get('parentId')
          ?.setValue(this.selectedAssignment.assignmentId);
        break;
      }
      case 'update':
        {
          if (this.selectedAssignment)
            this.assignmentForm
              .get('assignmentName')
              ?.setValue(this.selectedAssignment.assignmentName);
          this.assignmentForm
            .get('description')
            ?.setValue(this.selectedAssignment.description);
          this.assignmentForm
            .get('deadline')
            ?.setValue(
              new Date(this.selectedAssignment.deadline)
                .toISOString()
                .split('T')[0]
            );
        }
        break;
    }
  }
  deleteNode(assignment: any) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa công việc này?',
      header: 'Xác nhận xóa',
      // icon: 'pi pi-info-circle',
      accept: () => {
        const deleteAssignment = {
          id: assignment.assignmentId,
        };
        this.assignmentService.deleteAssignment(deleteAssignment).subscribe({
          next: (response) => {
            console.log(response);
            this.initData();
            this.assignmentVisible = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Xóa thành công',
              detail: 'Xóa thành công',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Xóa thất bại',
              detail: error.error.message,
            });
          },
        });
      },
      reject: (type: any) => {},
    });
  }
  add() {}
  update() {}
  assignmentPopuptHideEvent() {
    this.assignmentForm.reset();
  }
}
