import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { AssignmentService } from 'src/app/services/assignment.service';
import { AuthService } from 'src/app/services/auth.service';
import { FileService } from 'src/app/services/file.service';
import { IssueService } from 'src/app/services/issue.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { error } from '@angular/compiler-cli/src/transformers/util';
@Component({
  selector: 'app-assign-assignment',
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
    assigneeId: ['', Validators.required],
    isTask: ['', Validators.required],
  });
  typeAssignmentOptions: any[] = [];
  listOfPossibleAssignees: any[] = [];
  user: any;
  detailVisible = false;
  commentForm = this.fb.group({
    content: ['', Validators.required],
    userName: ['', Validators.required],
    createdDate: ['', Validators.required],
  });
  documents: any[] = [];
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  statusOptions = [
    {
      label: 'Chờ phê duyệt',
      value: 'Chờ phê duyệt',
      severity: 'warning',
      disabled: true,
    },
    {
      label: 'Phê duyệt',
      value: true,
      severity: 'success',
      disabled: false,
    },
    {
      label: 'Không phê duyệt',
      value: false,
      severity: 'danger',
      disabled: false,
    },
  ];
  selectedAssigneeId: number;
  // statusForm = this.fb.group({
  //   status: ['', Validators],
  // });
  ngOnInit(): void {
    this.user = this.authService.getSubFromCookie();
    console.log(this.user);
    this.typeAssignmentOptions = [
      { label: 'Thư mục', value: true },
      { label: 'Nộp tài liệu', value: false },
    ];
    this.assignmentService.getMyAssignedAssignments().subscribe({
      next: (data) => {
        this.assignments = data.assignmentListDtos;
      },
    });
  }
  constructor(
    private assignmentService: AssignmentService,
    private issueService: IssueService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) {}
  initData() {
    this.assignmentService.getMyAssignedAssignments().subscribe({
      next: (data) => {
        this.assignments = data.assignmentListDtos;
      },
    });
  }
  openDetail(assignment?: any, action?: string) {
    this.selectedAssignment = assignment;
    this.assignmentVisible = true;
    const parentIdObj = { parentId: assignment.assignmentId };
    this.assignmentService.getPossibleAssignee(parentIdObj).subscribe({
      next: (data) => {
        console.log(data);
        console.log(data.listOfPossibleAssignees);
        this.listOfPossibleAssignees = data.listOfPossibleAssignees;
      },
    });
    this.action = action;
    switch (action) {
      case 'addchild': {
        this.assignmentForm
          .get('parentId')
          ?.setValue(this.selectedAssignment.assignmentId);
        break;
      }
      case 'update':
        {
          if (this.selectedAssignment) {
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
        }
        break;
    }
  }
  deleteNode(assignment: any) {
    this.confirmationService.confirm({
      message:
        'Bạn có muốn xóa công việc ' + assignment.assignmentName + ' này?',
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
  add() {
    const deadlineValue = this.assignmentForm.get('deadline')?.value ?? '';
    const isoDateString = new Date(deadlineValue).toISOString();
    this.confirmationService.confirm({
      message: 'Bạn có muốn tạo mới công việc  này?',
      header: 'Xác nhận tạo mới',
      // icon: 'pi pi-info-circle',
      accept: () => {
        const data = {
          parentId: this.selectedAssignment.assignmentId,
          assignmentName: this.assignmentForm.get('assignmentName')?.value,
          deadline: isoDateString,
          description: this.assignmentForm.get('description')?.value,
          assigneeId: this.assignmentForm.get('assigneeId')?.value,
          isTask: this.assignmentForm.get('isTask')?.value,
        };
        this.assignmentService.addSchoolAssignment(data).subscribe({
          next: (data) => {
            this.initData();
            this.messageService.add({
              severity: 'success',
              summary: 'Thêm mới thành công',
              detail: 'Thêm mới thành công',
            });
            this.assignmentVisible = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Thêm mới thất bại',
              detail: error.error.message,
            });
          },
        });
      },
      reject: (type: any) => {},
    });
    console.log(this.selectedAssignment);
  }
  update() {
    
  }
  assignmentPopuptHideEvent() {
    this.assignmentForm.reset();
  }
  openDetailRowNode(rowNode: any, action: string) {
    this.action = action;
    // this.assignmentService
    //   .getAssignmentsById(rowNode.assignmentId)
    //   .subscribe((data) => {
    //     this.selectedAssignment = data;
    //     this.documents = data.documents;
    //     this.detailVisible = true;
    //   });
    this.selectedAssignment = rowNode;
    this.detailVisible = true;
    if (this.selectedAssignment) {
      this.assignmentForm
        .get('assignmentName')
        ?.setValue(this.selectedAssignment.assignmentName);
      this.assignmentForm
        .get('description')
        ?.setValue(this.selectedAssignment.description);
      this.assignmentForm
        .get('deadline')
        ?.setValue(
          new Date(this.selectedAssignment.deadline).toISOString().split('T')[0]
        );
    }
    console.log(rowNode);
  }
  getStatusSeverity(statusId: number): string {
    const statusSeverityMap: { [key: number]: string } = {
      15: 'success',
      16: 'warning',
      17: 'success',
      18: 'danger',
    };

    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
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
  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.fileService.readIssuePDF(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    });
  }
  hasAuthority(authority: string): boolean {
    // console.log('run here');
    return this.selectedAssignment.authorities.includes(authority);
  }
  hasAuthorityByRowNode(authority: string, rowNode: any): boolean {
    return rowNode.authorities.includes(authority);
  }
  completeOrCancelCF(status: boolean) {
    this.confirmationService.confirm({
      message:
        'Bạn có muốn ' +
        (status ? 'xác nhận hoàn thành' : 'hủy') +
        ' công việc  này?',
      header: status ? 'Xác nhận hoàn thành' : 'Xác nhận hủy',
      // icon: 'pi pi-info-circle',
      accept: () => {
        console.log(status);
        // this.assignmentService.deleteAssignment(deleteAssignment).subscribe({
        //   next: (response) => {
        //     console.log(response);
        //     this.initData();
        //     this.assignmentVisible = false;
        //     this.messageService.add({
        //       severity: 'success',
        //       summary: 'Xóa thành công',
        //       detail: 'Xóa thành công',
        //     });
        //   },
        //   error: (error) => {
        //     this.messageService.add({
        //       severity: 'error',
        //       summary: 'Xóa thất bại',
        //       detail: error.error.message,
        //     });
        //   },
        // });
      },
      reject: (type: any) => {},
    });
  }
}
