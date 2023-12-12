import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { switchMap } from 'rxjs';
import { AssignmentService } from 'src/app/services/assignment.service';
import { AuthService } from 'src/app/services/auth.service';
import { FileService } from 'src/app/services/file.service';
import { IssueService } from 'src/app/services/issue.service';
import { NoWhitespaceValidator } from 'src/app/shared/validators/no-white-space.validator';
import { Menu } from 'primeng/menu';
import { StompService } from '../../../push-notification/stomp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { Dialog } from 'primeng/dialog';
import { TreeTable } from 'primeng/treetable';
import {
  dateToTuiDay,
  getFirstAndLastName,
  toIsoString,
  tuiDayToDate,
  tuiDayToDateNull,
  unSub,
} from 'src/app/shared/util/util';
import { TuiDay } from '@taiga-ui/cdk';
@Component({
  providers: [ConfirmationService],
  selector: 'app-assign-assignment',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assign-assignment.component.html',
  styleUrls: ['./assign-assignment.component.scss'],
})
export class AssignAssignmentComponent implements OnInit, OnDestroy {
  issueId: number;
  assignments: any[];
  assignmentVisible = false;
  selectedAssignment: any;
  action: string | undefined;
  assignmentForm = this.fb.group({
    assignmentName: [
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(256),
        NoWhitespaceValidator(),
      ]),
    ],
    description: [
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(256),
        NoWhitespaceValidator(),
      ]),
    ],
    deadline: [dateToTuiDay(new Date()), Validators.required],
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
    content: [''],
    userName: ['', Validators.required],
    createdDate: ['', Validators.required],
  });
  documents: any[] = [];
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  documentUrl: SafeUrl;
  fileUrl: string;
  docxUrl: string;
  safeDocxUrl: SafeResourceUrl;
  documentContent: string | null = null;
  selectedAssigneeId: number;
  showComment = true;
  fileVisible = false;
  fileInputPlaceholders: string;
  @ViewChild('fileInput') fileInput: any;
  fileInputForm = this.fb.group({
    documentCode: [''],
    documentName: [
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(256),
        NoWhitespaceValidator(),
      ]),
    ],
    file: ['', Validators.required],
  });
  historyDtos: any[] = [];
  comments: any[] = [];
  items: MenuItem[] | undefined;
  menuVisible = false;
  deleteCommentId = 0;
  @ViewChild('menu') menu: Menu;
  isFileLoading = false;
  tabs: MenuItem[];
  activeTab: MenuItem | undefined;
  sub: any[] = [];
  pdfPreviewVisibility: boolean = false;
  @ViewChild('treeTable') treeTable: TreeTable;
  nodeStateMap: { [key: number]: boolean } = {};
  minDate: TuiDay;
  maxDate: TuiDay;
  today: Date = new Date();
  ngOnInit(): void {
    let issueId;
    this.user = this.authService.getSubFromCookie();
    console.log(this.user);
    this.typeAssignmentOptions = [
      { label: 'Thư mục', value: false },
      { label: 'Nộp tài liệu', value: true },
    ];
    this.assignmentForm.get('isTask')?.setValue(true);
    this.tabs = [
      {
        label: 'Bình luận',
        command: (click) => {
          console.log('Bình luận');
          this.showComment = true;
        },
      },
      {
        label: 'Lịch sử',
        command: (click) => {
          console.log('Lịch sử');
          this.showComment = false;
        },
      },
    ];
    this.activeTab = this.tabs[0];
    // lay issueId tu url goi theo issueId
    const method = this.activateRouter.params
      .pipe(
        switchMap((params) => {
          this.issueId = +params['issueId'];
          return this.assignmentService.getAssignmentByIssueId(this.issueId);
        })
      )
      .subscribe((data) => {
        this.assignments = data.assignmentListDtos;
        console.log(data.assignmentListDtos);

        // this.setExpandedForAllNodes(this.assignments);
        // this.restoreNodeState(this.assignments);
        // this.treeTable.expandAll();
      });
    this.sub.push(method);
    this.minDate = dateToTuiDay(new Date());
    // this.issueService.getCurrentActiveIssue().subscribe({
    //   next: (data) => {
    //     issueId = data.issueDto.issueId;
    //     this.assignmentService.getAssignmentByIssueId(issueId).subscribe({
    //       next: (data) => {
    //         this.assignments = data.assignmentListDtos;
    //       },
    //       error: (error) => {
    //         this.toastService.add({
    //           severity: 'error',
    //           summary: 'Xảy ra lỗi',
    //           detail: error.error.message,
    //         });
    //       },
    //     });
    //   },
    // });
    // this.assignmentService.getMyAssignedAssignments().subscribe({
    //   next: (data) => {
    //     this.assignments = data.assignmentListDtos;
    //   },
    // });

    this.items = [
      {
        label: 'Thao tác',
        items: [
          {
            label: 'Xóa',
            icon: 'bi bi-x-lg',
            command: () => {
              this.deleteComment();
            },
          },
        ],
      },
    ];
    this.activateRouter.queryParams.subscribe((params) => {
      if (params) {
        console.log('run here');
        const id = params['id'];
        console.log('****ID:' + id + '*****');
        if (id > 0) this.openDetailRowNode({ assignmentId: id }, 'info');
      }
    });
  }
  constructor(
    private assignmentService: AssignmentService,
    private issueService: IssueService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private stompService: StompService,
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {}
  initData() {
    const method = this.assignmentService
      .getAssignmentByIssueId(this.issueId)
      .subscribe({
        next: (data) => {
          this.assignments = data.assignmentListDtos;
          this.restoreNodeState(this.assignments);
        },
      });
    console.log(this.nodeStateMap);
    this.sub.push(method);
  }

  // ADD
  openDetail(assignment?: any, action?: string) {
    this.selectedAssignment = assignment;
    const parentIdObj = { parentId: assignment.assignmentId };
    const method = this.assignmentService
      .getPossibleAssignee(parentIdObj)
      .subscribe({
        next: (data) => {
          console.log(data);
          console.log(data.listOfPossibleAssignees);
          if (data.listOfPossibleAssignees) {
            this.listOfPossibleAssignees = data.listOfPossibleAssignees;
            this.selectedAssignee = this.listOfPossibleAssignees[0];
            this.assignmentForm
              .get('assigneeId')
              ?.setValue(this.listOfPossibleAssignees[0].accountId);
          }
          if (data.maxDate) {
            this.maxDate = data.maxDate;
          }
          this.assignmentVisible = true;
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
                dateToTuiDay(new Date(this.selectedAssignment.deadline))
              );
          }
        }
        break;
    }
    this.sub.push(method);
  }
  add() {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      console.log(this.assignmentForm.value);
      return;
    }
    const deadlineValue = tuiDayToDateNull(
      this.assignmentForm.get('deadline')?.value
    );
    this.confirmationService.confirm({
      message: 'Bạn có muốn tạo mới công việc này?',
      header: 'Xác nhận tạo mới',
      key: 'confirmAssignAssignment',
      accept: () => {
        const data = {
          parentId: this.selectedAssignment.assignmentId,
          assignmentName: this.assignmentForm.get('assignmentName')?.value,
          deadline: deadlineValue?.toISOString(),
          description: this.assignmentForm.get('description')?.value,
          assigneeId: this.assignmentForm.get('assigneeId')?.value,
          isTask: this.assignmentForm.get('isTask')?.value,
        };
        console.log(data);
        const method = this.assignmentService
          .addSchoolAssignment(data)
          .subscribe({
            next: (data) => {
              this.initData();
              this.toastService.showSuccess(
                'toastAssignAssignment',
                'Thêm mới thành công',
                'Thêm mới thành công'
              );
              this.assignmentVisible = false;
            },
            error: (error) => {
              this.toastService.showError(
                'toastAssignAssignment',
                'Thêm mới thất bại',
                error.error.message
              );
            },
          });
        this.sub.push(method);
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
      key: 'confirmAssignAssignment',

      // icon: 'pi pi-info-circle',
      accept: () => {
        const deleteAssignment = {
          id: assignment.assignmentId,
        };
        const method = this.assignmentService
          .deleteAssignment(deleteAssignment)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.initData();
              this.toastService.showSuccess(
                'toastAssignAssignment',
                'Xóa thành công',
                'Xóa thành công'
              );
            },
            error: (error) => {
              this.toastService.showError(
                'error',
                'Xóa thất bại',
                error.error.message
              );
            },
          });
        this.sub.push(method);
      },
      reject: (type: any) => {},
    });
  }
  // UPDATE
  openDetailRowNode(rowNode: any, action: string) {
    console.log(rowNode);
    this.action = action;

    const methodHis = this.assignmentService
      .getHistoryByAssignmentId(rowNode.assignmentId)
      .subscribe({
        next: (data) => {
          this.historyDtos = data.historyDtos;
          console.log(this.historyDtos);
        },
        error: () => {},
      });
    this.sub.push(methodHis);
    const methodComment = this.assignmentService
      .getCommentsByAssignmentId(rowNode.assignmentId)
      .subscribe({
        next: (data) => {
          this.comments = data.commentDtos;
        },
        error: (error) => {
          this.toastService.showError(
            'error',
            'Không tìm thấy công việc',
            error.error.message
          );
          this.router.navigate(['/assignassignment/' + this.issueId], {
            queryParams: {},
          });
        },
      });
    this.sub.push(methodComment);

    const methodAss = this.assignmentService
      .getAssignmentsById(rowNode.assignmentId)
      .subscribe((data) => {
        this.selectedAssignment = data;
        this.listOfPossibleAssignees = data.listOfPossibleAssginees;
        console.log(this.selectedAssignment);
        console.log(this.selectedAssignment.documents.length == 0);
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
              dateToTuiDay(new Date(this.selectedAssignment.deadline))
            );
          this.selectedAssignee = this.selectedAssignment.assignee;
          this.detailVisible = true;

          console.log(this.assignmentForm.get('deadline')?.value);
        }
      });
    this.sub.push(methodAss);

    console.log(rowNode.assignmentId);
    this.stompService.subscribe('/comment/' + rowNode.assignmentId, (): any => {
      this.refreshSelectedAssignment();
    });
  }
  update() {
    const deadlineValue = tuiDayToDateNull(
      this.assignmentForm.get('deadline')?.value
    );

    // console.log(toIsoString(deadlineValue));
    this.confirmationService.confirm({
      message: 'Bạn có muốn cập nhật công việc  này?',
      header: 'Xác nhận cập nhật',
      key: 'confirmAssignAssignment',
      // icon: 'pi pi-info-circle',
      accept: () => {
        const data = {
          updateAssignmentDto: {
            assignmentId: this.selectedAssignment.assignmentId,
            assignmentName: this.assignmentForm.get('assignmentName')?.value,
            deadline: deadlineValue?.toISOString(),
            description: this.assignmentForm.get('description')?.value,
          },
        };
        console.log(data);
        this.assignmentService.updateSchoolAssignment(data).subscribe({
          next: (data) => {
            this.initData();
            this.toastService.showSuccess(
              'toastAssignAssignment',
              'Cập nhật thành công',
              'Cập nhật thành công'
            );
          },
          error: (error) => {
            this.toastService.showError(
              'toastAssignAssignment',
              'Cập nhật thất bại',
              error.error.message
            );
          },
        });
      },
      reject: (type: any) => {},
    });
  }
  assignmentPopuptHideEvent() {
    this.assignmentForm.reset();
    this.showComment = true;
    this.stompService.unsubscribe(this.selectedAssignment.assignmentId);
    this.assignmentForm.get('isTask')?.setValue(false);
    this.activeTab = this.tabs[0];
    this.router.navigate(['/assignassignment/' + this.issueId], {
      queryParams: {},
    });
  }
  uploadFilePopupHideEvent() {
    this.fileInputForm.reset();
    this.fileInputPlaceholders = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
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

  // PREVIEW PDF
  openNewTab(documentLink: string, fileExtension: string) {
    if (fileExtension === 'application/pdf') {
      this.pdfPreviewVisibility = true;
    }
    const method = this.fileService
      .readAssignmentPDF(documentLink)
      .subscribe((response) => {
        const blobUrl = window.URL.createObjectURL(response.body as Blob);
        this.pdfUrl = blobUrl;
        this.safePdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.pdfLoaded = true;
      });
    this.sub.push(method);
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
      key: 'confirmAssignAssignment',
      // icon: 'pi pi-info-circle',
      accept: () => {
        const data = {
          assignmentId: this.selectedAssignment.assignmentId,
          isConfirm: status,
        };
        const method = this.assignmentService
          .confirmAssignment(data)
          .subscribe({
            next: (data) => {
              this.detailVisible = false;
              this.initData();
              this.toastService.showSuccess(
                'toastAssignAssignment',
                'Xác nhận',
                status ? 'Xác nhận thành công' : 'Hủy xác nhận thành công'
              );
            },
            error: (error) => {
              this.toastService.showError(
                'error',
                'Xác nhận thất bại',
                error.error.message
              );
            },
          });
        this.sub.push(method);
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
    const method = this.assignmentService.assignAssignment(data).subscribe({
      next: (data) => {
        this.initData();
        this.refreshSelectedAssignment();
        this.toastService.showSuccess(
          'toastAssignAssignment',
          'Đổi thành công',
          'Đổi người làm thành công'
        );
      },
      error: (error) => {
        this.toastService.showError(
          'toastAssignAssignment',
          'Đổi thất bại',
          'Đổi người làm thất bại'
        );
      },
    });
    this.sub.push(method);
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
    if (this.fileInputForm.invalid) {
      this.fileInputForm.markAllAsTouched();
      return;
    }
    this.isFileLoading = true;
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
    const method = this.assignmentService.uploadDocument(formData).subscribe({
      next: (data) => {
        this.refreshSelectedAssignment();
        this.fileVisible = false;
        this.isFileLoading = false;
      },
      error: (error) => {},
    });
    this.sub.push(method);
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
      key: 'confirmAssignAssignment',
      accept: () => {
        this.isFileLoading = true;
        this.documents.splice(index, 1);
        const deleteDocument = {
          assignmentId: this.selectedAssignment.assignmentId,
          documentId: documentId,
        };
        const method = this.assignmentService
          .deleteDocument(deleteDocument)
          .subscribe({
            next: (data) => {
              this.refreshSelectedAssignment();
              this.isFileLoading = false;
              this.toastService.showSuccess(
                'toastAssignAssignment',
                'Xóa thành công',
                'Xóa tài liệu thành công'
              );
            },
            error: (error) => {
              this.toastService.showError(
                'toastAssignAssignment',
                'Xóa thất bại',
                error.error.message
              );
            },
          });
        this.sub.push(method);
      },
    });
  }
  submit() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn nộp công việc này?',
      header: 'Xác nhận nộp',
      icon: 'bi bi-exclamation-triangle-fill',
      key: 'confirmAssignAssignment',
      accept: () => {
        const jsonData = {
          assignmentId: this.selectedAssignment.assignmentId,
          isSubmit: true,
        };
        const method = this.assignmentService
          .submitAssignment(jsonData)
          .subscribe({
            next: (data) => {
              this.selectedAssignment = data;
              this.initData();
              this.toastService.showSuccess(
                'toastAssignAssignment',
                'Nộp thành công',
                'Nộp thành công'
              );
            },
            error: (error) => {
              this.toastService.showError(
                'toastAssignAssignment',
                'Nộp thất bại',
                error.error.message
              );
            },
          });
        this.sub.push(method);
      },
      reject: (type: any) => {},
    });
  }
  // CANCEL COMPLETE
  cancel() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn hủy công việc này?',
      header: 'Xác nhận hủy',
      icon: 'bi bi-exclamation-triangle-fill',
      key: 'confirmAssignAssignment',

      accept: () => {
        const jsonData = {
          assignmentId: this.selectedAssignment.assignmentId,
          isSubmit: false,
        };
        const method = this.assignmentService
          .submitAssignment(jsonData)
          .subscribe({
            next: (data) => {
              this.selectedAssignment = data;
              this.initData();
              this.toastService.showSuccess(
                'toastAssignAssignment',
                'Hủy nộp thành công',
                'Hủy nộp thành công'
              );
            },
            error: (error) => {
              this.toastService.showError(
                'toastAssignAssignment',
                'Hủy nộp thất bại',
                error.error.message
              );
            },
          });
        this.sub.push(method);
      },
      reject: (type: any) => {},
    });
  }
  // EVALUATE
  evaluate(isPassed: Boolean) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn đánh giá công việc này?',
      header: 'Xác nhận đánh giá',
      icon: 'bi bi-exclamation-triangle-fill',
      key: 'confirmAssignAssignment',
      accept: () => {
        const method = this.assignmentService
          .evaluateTask({
            assignmentId: this.selectedAssignment.assignmentId,
            isPassed: isPassed,
          })
          .subscribe({
            next: (data) => {
              this.selectedAssignment = data;
              this.initData();
              this.toastService.showSuccess(
                'toastAssignAssignment',
                'Đánh giá',
                isPassed ? 'Phê duyệt thành công' : 'Không phê duyệt thành công'
              );
            },
            error: (error) => {
              this.toastService.showError(
                'toastAssignAssignment',
                'Phê duyệt',
                error.error.message
              );
            },
          });
        this.sub.push(method);
      },
    });
  }
  // Comment
  sendComment() {
    console.log();
    const data = {
      content: this.commentForm.get('content')?.value,
      assignmentId: this.selectedAssignment.assignmentId,
    };
    const method = this.assignmentService.addComment(data).subscribe({
      next: () => {
        this.toastService.showSuccess(
          'toastAssignAssignment',
          'Bình luận thành công',
          'Bình luận thành công'
        );
        this.refreshSelectedAssignment();
      },
    });
    this.sub.push(method);
    this.commentForm.reset();
  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendComment();
    }
  }
  private refreshSelectedAssignment() {
    console.log('refresh');
    const assignmentId = this.selectedAssignment?.assignmentId;

    if (assignmentId) {
      const methodAss = this.assignmentService
        .getAssignmentsById(assignmentId)
        .subscribe({
          next: (data) => {
            this.selectedAssignment = data;
          },
          error: (error) => {
            console.error('Error refreshing assignment:', error);
          },
        });
      this.sub.push(methodAss);
      const methodHis = this.assignmentService
        .getHistoryByAssignmentId(assignmentId)
        .subscribe({
          next: (data) => {
            this.historyDtos = data.historyDtos;
            console.log(this.historyDtos);
          },
          error: () => {},
        });
      this.sub.push(methodHis);
      const methodComment = this.assignmentService
        .getCommentsByAssignmentId(assignmentId)
        .subscribe({
          next: (data) => {
            this.comments = data.commentDtos;
          },
          error: () => {},
        });
      this.sub.push(methodComment);
    }
  }
  toggleMenu(commentId: number, event: Event) {
    if (this.menu) {
      this.menu.toggle(event);
    }
    this.menuVisible = true;
    this.deleteCommentId = commentId;
    console.log(commentId);
  }
  deleteComment() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa bình luận này?',
      header: 'Xác nhận tạo mới',
      key: 'confirmAssignment',
      accept: () => {
        const method = this.assignmentService
          .deleteComment({
            assignmentId: this.selectedAssignment.assignmentId,
            commentId: this.deleteCommentId,
          })
          .subscribe({
            next: () => {
              this.toastService.showSuccess(
                'toastAssignAssignment',
                'Xóa bình luận',
                'Xóa bình luận thành công'
              );
              this.refreshSelectedAssignment();
            },
            error: (error) => {
              this.toastService.showError(
                'error',
                'Xóa bị lỗi',
                error.error.message
              );
            },
          });
        this.sub.push(method);
      },
    });
  }
  getIconFileType(fileExtension: string): string {
    let url = '';
    switch (fileExtension) {
      case 'application/pdf':
        url = '../../../../../assets/img/pdf_logo.svg';
        break;
      case 'application/msword':
        url = '../../../../../assets/img/doc.png';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        url = '../../../../../assets/img/doc.png';
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        url = '../../../../../assets/img/xls.png';
        break;
    }
    return url;
  }
  getFileExtension(fileExtension: string): string {
    let extension = '';
    switch (fileExtension) {
      case 'application/pdf':
        extension = 'pdf';
        break;
      case 'application/msword':
        extension = 'docx';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        extension = 'docx';
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        extension = 'xlsx';
        break;
    }
    return extension;
  }
  onHideFilePreviewEvent() {
    this.pdfUrl = '';
    this.safePdfUrl = '';
    this.pdfLoaded = false;
  }
  navigateChildren(assignmentId: number) {
    this.router.navigate(['/assignassignment', this.issueId], {
      queryParams: { id: assignmentId },
    });
  }
  setExpandedForAllNodes(nodes: any[]) {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        this.setExpandedForAllNodes(node.children);
      }
      node.expanded = true;
      this.nodeStateMap[node.assignmentId] = true;
    });
  }
  onNodeExpand(event: any) {
    const node = event.node;
    console.log('Node Toggle Event:', event);
    this.nodeStateMap[node.assignmentId] = node.expanded;
    console.log(this.nodeStateMap);
  }
  onNodeCollapse(event: any) {
    const node = event.node;
    console.log('Node Toggle Event:', event);
    this.nodeStateMap[node.assignmentId] = node.expanded;
    console.log(this.nodeStateMap);
  }
  restoreNodeState(nodes: any[]) {
    nodes.forEach((node) => {
      if (this.nodeStateMap[node.assignmentId] !== undefined) {
        node.expanded = this.nodeStateMap[node.assignmentId];
      }

      if (node.children && node.children.length > 0) {
        this.restoreNodeState(node.children);
      }
    });
  }
  ngOnDestroy(): void {
    unSub(this.sub);
  }

  getAvatar(fullName: string): string {
    return getFirstAndLastName(fullName);
  }
}
