import { Component, OnInit, ViewChild } from '@angular/core';
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
import { NoWhitespaceValidator } from 'src/app/shared/validators/no-white-space.validator';
@Component({
  providers: [ConfirmationService],
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
    isTask: [false, Validators.required],
  });
  typeAssignmentOptions: any[] = [];
  listOfPossibleAssignees: any[] = [];
  user: any;
  detailVisible = false;
  canSubmit = true;
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
  showComment = true;
  fileVisible = false;
  fileInputPlaceholders: string;
  @ViewChild('fileInput') fileInput: any;
  fileInputForm = this.fb.group({
    documentCode: ['', NoWhitespaceValidator],
    documentName: ['', Validators.required],
    file: ['', Validators.required],
  });
  ngOnInit(): void {
    this.user = this.authService.getSubFromCookie();
    console.log(this.user);
    this.typeAssignmentOptions = [
      { label: 'Thư mục', value: false },
      { label: 'Nộp tài liệu', value: true },
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
  // ADD
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
        // this.assignmentForm.get('isTask')?.setValue(false);
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
  add() {
    const deadlineValue = this.assignmentForm.get('deadline')?.value ?? '';
    const isoDateString = new Date(deadlineValue).toISOString();
    this.confirmationService.confirm({
      message: 'Bạn có muốn tạo mới công việc  này?',
      header: 'Xác nhận tạo mới',
      accept: () => {
        const data = {
          parentId: this.selectedAssignment.assignmentId,
          assignmentName: this.assignmentForm.get('assignmentName')?.value,
          deadline: isoDateString,
          description: this.assignmentForm.get('description')?.value,
          assigneeId: this.assignmentForm.get('assigneeId')?.value,
          isTask: this.assignmentForm.get('isTask')?.value,
        };
        console.log(data);
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
  // DELETE
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
  // UPDATE
  openDetailRowNode(rowNode: any, action: string) {
    console.log(rowNode);
    this.action = action;
    // const parentIdObj = { parentId: rowNode.parentId };
    // this.assignmentService.getPossibleAssignee(parentIdObj).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     console.log(data.listOfPossibleAssignees);
    //     this.listOfPossibleAssignees = data.listOfPossibleAssignees;
    //   },
    // });
    this.assignmentService
      .getAssignmentsById(rowNode.assignmentId)
      .subscribe((data) => {
        this.selectedAssignment = data;
        this.listOfPossibleAssignees = data.listOfPossibleAssginees;
        console.log(this.selectedAssignment);
        this.documents = data.documents;
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
          this.selectedAssignee = this.selectedAssignment.assignee;
          this.detailVisible = true;

          console.log(this.assignmentForm.get('deadline')?.value);
        }
      });
  }
  update() {
    const deadlineValue = this.assignmentForm.get('deadline')?.value ?? '';
    const isoDateString = new Date(deadlineValue).toISOString();
    this.confirmationService.confirm({
      message: 'Bạn có muốn cập nhật công việc  này?',
      header: 'Xác nhận cập nhật',
      // icon: 'pi pi-info-circle',
      accept: () => {
        const data = {
          updateAssignmentDto: {
            assignmentId: this.selectedAssignment.assignmentId,
            assignmentName: this.assignmentForm.get('assignmentName')?.value,
            deadline: isoDateString,
            description: this.assignmentForm.get('description')?.value,
          },
        };
        console.log(data);
        this.assignmentService.updateSchoolAssignment(data).subscribe({
          next: (data) => {
            this.initData();
            this.messageService.add({
              severity: 'success',
              summary: 'Cập nhật thành công',
              detail: 'Cập nhật thành công',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Cập nhật thất bại',
              detail: error.error.message,
            });
          },
        });
      },
      reject: (type: any) => {},
    });
  }
  assignmentPopuptHideEvent() {
    this.assignmentForm.reset();
    // this.initData();
  }

  getStatusSeverity(statusId: number): string {
    const statusSeverityMap: { [key: number]: string } = {
      15: 'success',
      16: 'warning',
      17: 'success',
      18: 'danger',
    };

    return statusSeverityMap[statusId] || 'info';
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
  // PREVIEW PDF
  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.fileService.readIssuePDF(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    });
  }
  // check authorities
  hasAuthority(authority: string): boolean {
    // console.log('run here');
    return this.selectedAssignment.authorities.includes(authority);
  }
  hasAuthorityByRowNode(authority: string, rowNode: any): boolean {
    return rowNode.authorities.includes(authority);
  }
  // COMPLETE TASK
  completeOrCancelCF(status: boolean) {
    this.confirmationService.confirm({
      message:
        'Bạn có muốn ' +
        (status ? 'xác nhận hoàn thành' : 'hủy xác nhận') +
        ' công việc  này?',
      header: status ? 'Xác nhận hoàn thành' : 'Xác nhận hủy',
      // icon: 'pi pi-info-circle',
      accept: () => {
        const data = {
          assignmentId: this.selectedAssignment.assignmentId,
          isConfirm: status,
        };
        this.assignmentService.confirmAssignment(data).subscribe({
          next: (data) => {
            this.detailVisible = false;
            this.initData();
            this.messageService.add({
              severity: 'success',
              summary: 'Xác nhận',
              detail: status
                ? 'Xác nhận thành công'
                : 'Hủy xác nhận thành công',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Xác nhận thất bại',
              detail: error.error.message,
            });
          },
        });
      },
      reject: (type: any) => {},
    });
  }
  // check cannot update ass template = true
  isReadOnly(): Boolean {
    return this.selectedAssignment.template && this.action === 'update';
  }
  // ASSIGN
  selectedAssignee: any;
  onChangeStatus(event: any) {
    const selectedStatus = event.value;
    console.log('Selected Status:', selectedStatus);
  }
  onChangeAssignee(event: any) {
    const selectedAssignee = event.value;
    console.log('Selected assignee:', selectedAssignee);
    const data = {
      assignmentId: this.selectedAssignment.assignmentId,
      assigneeId: selectedAssignee.accountId,
    };
    this.assignmentService.assignAssignment(data).subscribe({
      next: (data) => {
        this.initData();
        this.messageService.add({
          severity: 'success',
          summary: 'Đổi thành công',
          detail: 'Đổi người làm thành công',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Đổi thất bại',
          detail: 'Đổi người làm thất bại',
        });
      },
    });
  }

  onPatchAssigneeId() {
    console.log('Patch' + this.selectedAssignee);
    this.assignmentForm.patchValue({
      assigneeId: this.selectedAssignee.accountId, // dung k hay no khac
    });
  }
  showFilePopup() {
    this.fileVisible = true;
  }
  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.fileInputPlaceholders = file.name;
      this.fileInputForm.get('file')?.setValue(file);
    }
  }
  uploadFiles() {
    const documentData = {
      assignmentId: this.selectedAssignment.assignmentId,
      documentCode: this.fileInputForm.get('documentCode')?.value,
      documentName: this.fileInputForm.get('documentName')?.value,
    };
    console.log(documentData);
    const formData = new FormData();
    formData.append(
      'document',
      new Blob([JSON.stringify(documentData)], { type: 'application/json' })
    );
    const fileControl = this.fileInputForm.get('file');
    if (fileControl?.value) {
      const pdfFile = fileControl.value;
      formData.append('files', pdfFile);
    }
    this.assignmentService.uploadDocument(formData).subscribe({
      next: (data) => {
        this.documents = data.documents;
        console.log(this.documents);
        this.fileVisible = false;
      },
      error: (error) => {},
    });
    // this.documents.push(data);
    this.fileInputForm.reset();
    this.fileInputPlaceholders = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    console.log(this.documents);
  }
  removeDoc(index: number, documentId: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa tài liệu  này?',
      header: 'Xác nhận xóa',
      accept: () => {
        this.documents.splice(index, 1);
        const deleteDocument = {
          assignmentId: this.selectedAssignment.assignmentId,
          documentId: documentId,
        };
        this.assignmentService.deleteDocument(deleteDocument).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Xóa thành công',
              detail: 'Xóa tài liệu thành công',
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
    });
  }
  submit() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn nộp công việc này?',
      header: 'Xác nhận nộp',
      icon: 'bi bi-exclamation-triangle-fill',
      accept: () => {
        const jsonData = {
          assignmentId: this.selectedAssignment.assignmentId,
          isSubmit: true,
        };
        this.assignmentService.submitAssignment(jsonData).subscribe({
          next: (data) => {
            this.selectedAssignment = data;
            this.messageService.add({
              severity: 'success',
              summary: 'Nộp thành công',
              detail: 'Nộp thành công',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Nộp thất bại',
              detail: error.error.message,
            });
          },
        });
      },
      reject: (type: any) => {},
    });
  }
  cancel() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn hủy công việc này?',
      header: 'Xác nhận hủy',
      icon: 'bi bi-exclamation-triangle-fill',
      accept: () => {
        const jsonData = {
          assignmentId: this.selectedAssignment.assignmentId,
          isSubmit: false,
        };
        this.assignmentService.submitAssignment(jsonData).subscribe({
          next: (data) => {
            this.selectedAssignment = data;
            this.messageService.add({
              severity: 'success',
              summary: 'Hủy nộp thành công',
              detail: 'Hủy nộp thành công',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Hủy nộp thất bại',
              detail: error.error.message,
            });
          },
        });
      },
      reject: (type: any) => {},
    });
  }
  evaluate(isPassed: Boolean) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn đánh giá công việc này?',
      header: 'Xác nhận đánh giá',
      icon: 'bi bi-exclamation-triangle-fill',
      accept: () => {
        this.assignmentService
          .evaluateTask({
            assignmentId: this.selectedAssignment.assignmentId,
            isPassed: isPassed,
          })
          .subscribe({
            next: (data) => {
              this.selectedAssignment = data;
              this.initData();
              this.messageService.add({
                severity: 'success',
                summary: 'Phê duyệt',
                detail: 'Đánh giá thành công',
              });
              this.expandAllNode();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Phê duyệt',
                detail: error.error.message,
              });
            },
          });
      },
    });
  }
  expandAllNode() {
    this.assignments.forEach((node) => (node.expanded = false));
  }
}
