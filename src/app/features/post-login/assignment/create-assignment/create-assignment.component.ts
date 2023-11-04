import { error } from '@angular/compiler-cli/src/transformers/util';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { switchMap } from 'rxjs';
import { Issue } from 'src/app/models/issue.model';
import { AssignmentService } from 'src/app/services/assignment.service';
import { IssueService } from 'src/app/services/issue.service';
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
export class CreateAssignmentComponent {
  assignments!: any[];
  items!: MenuItem[];
  selectedAssignment: any;
  visibleNewNode = false;
  assignmentVisible = false;
  date = JSON.stringify(new Date());
  action: string | undefined;
  issueId: number;
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private assignmentService: AssignmentService,
    private issueService: IssueService
  ) {}
  // newNodeForm = this.fb.group({
  //   nodeName: ['', Validators.required],
  // });
  assignmentForm = this.fb.group({
    assignmentName: ['', Validators.required],
    description: ['', Validators.required],
    deadline: ['', Validators.required],
    parentId: ['', Validators.required],
  });
  ngOnInit() {
    this.initData();

    // Don't use console.log(this.issueId) here, as it will be executed before the subscription's callback

    console.log(this.assignments);
  }
  initData() {
    this.issueService
      .getCurrentActiveIssue()
      .pipe(
        switchMap((data) => {
          console.log(data);
          this.issueId = data.issueDto.issueId;
          return this.assignmentService.getAssignmentsByIssueId(
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
  viewFile(file: TreeNode) {
    // this.messageService.add({
    //   severity: 'info',
    //   summary: 'Node Details',
    //   detail: file.label,
    // });
    this.visibleNewNode = true;
    console.log(file.children?.length);
  }
  // addNewNode() {
  //   if (this.selectedFile == null) {
  //     const newNode: TreeNode = {
  //       key: this.files.length + '',
  //       label: this.newNodeForm.get('nodeName')?.value + '',
  //       data: this.newNodeForm.get('nodeName')?.value,
  //       icon: 'pi pi-fw pi-cog',
  //       children: [],
  //     };
  //     this.files.push(newNode);
  //   } else {
  //     const newNode: TreeNode = {
  //       key:
  //         this.selectedFile.children == null
  //           ? this.selectedFile.key + '-0'
  //           : this.selectedFile.key + '-' + this.selectedFile?.children.length,
  //       label: this.newNodeForm.get('nodeName')?.value + '',
  //       data: this.newNodeForm.get('nodeName')?.value,
  //       icon: 'pi pi-fw pi-cog',
  //       children: [],
  //     };
  //     console.log(newNode);
  //     for (const item of this.files) {
  //       this.addNodeToParent(item, newNode);
  //     }
  //   }

  //   console.log(this.files);
  //   this.visibleNewNode = false;
  // }
  // deleteContextMenu() {
  //   for (const item of this.files) {
  //     this.deleteNodeByKey(item, this.selectedFile.key);
  //   }
  // }
  // addNodeToParent(parent: TreeNode<string>, newNode: TreeNode<string>): void {
  //   if (parent.key === this.selectedFile.key) {
  //     if (parent.children) {
  //       parent.children.push(newNode);
  //     } else {
  //       parent.children = [newNode];
  //     }
  //     return;
  //   }

  //   if (parent.children) {
  //     for (const child of parent.children) {
  //       this.addNodeToParent(child, newNode);
  //     }
  //   }
  // }
  // deleteNodeByKey(parent: TreeNode<string> | undefined, key: string): void {
  //   if (!parent || !parent.children) {
  //     return;
  //   }

  //   parent.children = parent.children.filter((child) => child.key !== key);

  //   for (const child of parent.children) {
  //     this.deleteNodeByKey(child, key);
  //   }
  // }
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
    let addedAssignment;
    if (this.action == 'addroot') {
      addedAssignment = {
        addAssignmentDto: {
          assignmentName: this.assignmentForm.get('assignmentName')?.value,
          description: this.assignmentForm.get('description')?.value,
          deadline: this.parseDateStringToDate(
            this.assignmentForm.get('deadline')?.value
          ),
          issueId: this.issueId,
        },
      };
    } else {
      addedAssignment = {
        addAssignmentDto: {
          assignmentName: this.assignmentForm.get('assignmentName')?.value,
          description: this.assignmentForm.get('description')?.value,
          deadline: this.parseDateStringToDate(
            this.assignmentForm.get('deadline')?.value
          ),
          parentId: this.assignmentForm.get('parentId')?.value,
          issueId: this.issueId,
        },
      };
    }
    this.assignmentService.addAssignment(addedAssignment).subscribe({
      next: (response) => {
        this.initData();
        this.assignmentVisible = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  update() {
    const updateAssignment = {
      updateAssignmentDto: {
        assignmentId: this.selectedAssignment.assignmentId,
        assignmentName: this.assignmentForm.get('assignmentName')?.value,
        description: this.assignmentForm.get('description')?.value,
        deadline: this.parseDateStringToDate(
          this.assignmentForm.get('deadline')?.value
        ),
      },
    };
    this.assignmentService.updateAssignment(updateAssignment).subscribe({
      next: (response) => {
        this.initData();
        this.assignmentVisible = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
    console.log('Update');
    console.log(updateAssignment);
  }
  deleteNode(assignment: any) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa công việc này?',
      header: 'Xác nhận xóa',
      // icon: 'pi pi-info-circle',
      accept: () => {
        const deleteNode = {
          id: assignment.assignmentId,
        };
        this.messageService.add({
          severity: 'success',
          summary: 'Xóa',
          detail: 'Xóa thành công',
        });
      },
      reject: (type: any) => {
        // switch (type) {
        //   case ConfirmEventType.REJECT:
        //     this.messageService.add({
        //       severity: 'error',
        //       summary: 'Rejected',
        //       detail: 'You have rejected',
        //     });
        //     break;
        //   case ConfirmEventType.CANCEL:
        //     this.messageService.add({
        //       severity: 'warn',
        //       summary: 'Cancelled',
        //       detail: 'You have cancelled',
        //     });
        //     break;
        //   default:
        //     // Handle other cases, if necessary
        //     break;
        // }
      },
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
}
