import { DatePipe } from '@angular/common';
import { error } from '@angular/compiler-cli/src/transformers/util';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { Observable, concatMap, from, switchMap } from 'rxjs';
import { Issue } from 'src/app/models/issue.model';
import { AssignmentService } from 'src/app/services/assignment.service';
import { IssueService } from 'src/app/services/issue.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { unSub } from 'src/app/shared/util/util';
import { NoWhitespaceValidator } from 'src/app/shared/validators/no-white-space.validator';
interface TreeNode {
  assignmentId: number;
  assignmentName: string;
  deadline: string;
  createdDate: string | null;
  parentId: number | null;
  issueId: number;
  description: string;
  assigner: object | null;
  assignee?: object | null;
  children: TreeNode[];
  status: object;
  task: boolean;
}
@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.scss'],
})
export class CreateAssignmentComponent implements OnInit, OnDestroy {
  assignments: any[] = [];
  items!: MenuItem[];
  selectedAssignment: any;
  visibleNewNode = false;
  assignmentVisible = false;
  date = JSON.stringify(new Date());
  action: string | undefined;
  issueId: number;
  data: any;
  sub: any[];
  issueNotFound: boolean = false;
  nodeStateMap: { [key: number]: boolean } = {};
  constructor(
    private toastService: ToastService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private assignmentService: AssignmentService,
    private issueService: IssueService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}
  // newNodeForm = this.fb.group({
  //   nodeName: ['', Validators.required],
  // });
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
    deadline: [''],
    parentId: [''],
  });
  ngOnInit() {
    this.initData();
  }
  initData() {
    const method = this.assignmentService.getDeptAssignments().subscribe({
      next: (data) => {
        console.log(data);
        this.data = data;
        this.assignments = [data.assignmentListDto];
        this.restoreNodeState(this.assignments);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Thông báo',
          detail: 'Bạn chưa tạo kế hoạch kiểm tra',
          life: 3000,
        });
        this.issueNotFound = true;
        console.log('OKKKK ' + this.issueNotFound);
      },
    });
    // this.sub.push(method);
  }
  openDetail(assignment?: any, action?: string) {
    this.assignmentVisible = true;
    this.selectedAssignment = assignment;
    this.action = action;
    switch (action) {
      case 'addroot': {
        break;
      }
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
  add() {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }
    let addedAssignment;
    if (this.action == 'addroot') {
      addedAssignment = {
        addAssignmentDto: {
          assignmentName: this.assignmentForm.get('assignmentName')?.value,
          description: this.assignmentForm.get('description')?.value,
          // deadline: this.assignmentForm.get('deadline')?.value + 'T23:59',
          issueId: this.issueId,
          isTask: false,
        },
      };
    } else {
      addedAssignment = {
        assignmentName: this.assignmentForm.get('assignmentName')?.value,
        description: this.assignmentForm.get('description')?.value,
        // deadline: this.assignmentForm.get('deadline')?.value + 'T23:59',
        parentId: this.assignmentForm.get('parentId')?.value,
        // issueId: this.issueId,
        // isTask: false,
      };
    }
    console.log(addedAssignment);
    const method = this.assignmentService
      .addDeptAssignment(addedAssignment)
      .subscribe({
        next: (response) => {
          this.initData();
          this.assignmentVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Thông báo',
            detail: 'Tạo thành công',
          });
        },
        error: (error) => {
          console.log(error);
          this.assignmentVisible = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: error.error.message,
          });
        },
      });
    this.sub.push(method);
  }
  update() {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }
    const updateAssignment = {
      assignmentId: this.selectedAssignment.assignmentId,
      assignmentName: this.assignmentForm.get('assignmentName')?.value,
      description: this.assignmentForm.get('description')?.value,
    };
    console.log(updateAssignment);
    const method = this.assignmentService
      .updateDeptAssignment(updateAssignment)
      .subscribe({
        next: (response) => {
          this.initData();
          this.assignmentVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Thông báo',
            detail: 'Cập nhật thành công',
          });
        },
        error: (error) => {
          this.assignmentVisible = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi cập nhật',
            detail: error.error.message,
          });
        },
      });
    console.log('Update');
    console.log(updateAssignment);
    this.sub.push(method);
  }
  deleteNode(assignment: any) {
    console.log(assignment);
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa công việc ' + assignment.assignmentName + '?',
      header: 'Xác nhận xóa',
      icon: 'bi bi-exclamation-triangle-fill',
      key: 'confirm',
      accept: () => {
        const deleteAssignment = {
          id: assignment.assignmentId,
        };
        console.log(deleteAssignment);
        const method = this.assignmentService
          .deleteDeptAssignment(deleteAssignment)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.initData();
              this.assignmentVisible = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Thông báo',
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
        this.sub.push(method);
      },
      reject: (type: any) => {},
    });
  }

  assignmentPopuptHideEvent() {
    this.assignmentForm.reset();
  }
  parseDateStringToDate(dateString: string | null | undefined): Date | null {
    if (dateString === null || dateString === undefined) {
      return null; // Return null for null or undefined input
    }

    const [year, month, day] = dateString.split('-').map(Number);

    // Check if the date components are valid
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return null; // Return null for an invalid date
    }

    // Create a new Date object with the components
    const dateObject = new Date(year, month - 1, day);

    return dateObject;
  }
  sendToSchools() {
    if (this.data.sent) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Không thể gửi',
        detail: 'Mẫu cây công việc đã được gửi',
      });
    } else {
      this.confirmationService.confirm({
        message: 'Bạn có muốn gửi mẫu cây công việc không?',
        header: 'Xác nhận gửi',
        // icon: 'bi bi-exclamation-triangle-fill',
        key: 'confirm',
        accept: () => {
          const method = this.assignmentService
            .sendAssignmentsToSchool()
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Thông báo',
                  detail: 'Gửi mẫu cây công việc thành công',
                });
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Gửi thất bại',
                  detail: error.error.message,
                });
              },
            });
          // this.sub.push(method);
        },
        reject: (type: any) => {},
      });
    }
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
    console.log('restore');
    console.log(this.nodeStateMap);
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
  ngOnDestroy(): void {
    unSub(this.sub);
  }
}
