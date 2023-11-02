import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
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
  assignments!: TreeNode[];
  items!: MenuItem[];
  selectedAssignment: any;
  visibleNewNode = false;
  assignmentVisible = false;
  date = JSON.stringify(new Date());
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}
  // newNodeForm = this.fb.group({
  //   nodeName: ['', Validators.required],
  // });
  assignmentForm = this.fb.group({
    assignmentName: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
  });
  ngOnInit() {
    this.assignments = [
      {
        assignmentId: 1,
        assignmentName: 'Assignment 1',
        assigner: {
          accountId: 2,
          email: 'hunglengoc2109@gmail.com',
          user: {
            userId: 2,
            fullName: 'Trần Lê Hải',
            dob: '1999-03-01',
            gender: 'MALE',
            phoneNumber: '0394335205',
          },
          school: {
            schoolId: 1,
            schoolName: 'PGD VÀ ĐÀO TẠO',
            exactAddress: 'Quan Hoa, Cầu Giấy, Hà Nội',
            isActive: true,
          },
          roles: [
            {
              roleId: 2,
              roleName: 'Trưởng Phòng',
              isSchoolEmployee: false,
            },
          ],
        },
        assignee: null,
        deadline: '2023-10-31T18:00:00',
        createdDate: '2023-11-02T19:55:33.375485',
        children: [
          {
            assignmentId: 2,
            assignmentName: 'Child Assignment 1',
            assigner: {
              accountId: 2,
              email: 'hunglengoc2109@gmail.com',
              user: {
                userId: 2,
                fullName: 'Trần Lê Hải',
                dob: '1999-03-01',
                gender: 'MALE',
                phoneNumber: '0394335205',
              },
              school: {
                schoolId: 1,
                schoolName: 'PGD VÀ ĐÀO TẠO',
                exactAddress: 'Quan Hoa, Cầu Giấy, Hà Nội',
                isActive: true,
              },
              roles: [
                {
                  roleId: 2,
                  roleName: 'Trưởng Phòng',
                  isSchoolEmployee: false,
                },
              ],
            },
            assignee: null,
            deadline: '2023-11-05T10:00:00',
            createdDate: '2023-11-02T19:55:33.390971',
            children: [
              {
                assignmentId: 3,
                assignmentName: 'Assignment Grand ',
                assigner: {
                  accountId: 2,
                  email: 'hunglengoc2109@gmail.com',
                  user: {
                    userId: 2,
                    fullName: 'Trần Lê Hải',
                    dob: '1999-03-01',
                    gender: 'MALE',
                    phoneNumber: '0394335205',
                  },
                  school: {
                    schoolId: 1,
                    schoolName: 'PGD VÀ ĐÀO TẠO',
                    exactAddress: 'Quan Hoa, Cầu Giấy, Hà Nội',
                    isActive: true,
                  },
                  roles: [
                    {
                      roleId: 2,
                      roleName: 'Trưởng Phòng',
                      isSchoolEmployee: false,
                    },
                  ],
                },
                assignee: null,
                deadline: '2023-11-10T12:00:00',
                createdDate: '2023-11-02T19:55:33.393377',
                children: [],
                issueId: 1,
                description: 'This is Grand',
                status: {
                  statusId: 13,
                  statusName: 'Chưa bắt đầu',
                  statusType: 'Đầu công việc',
                },
                parentId: 2,
                task: false,
              },
            ],
            issueId: 1,
            description: 'This is child assignment 1',
            status: {
              statusId: 13,
              statusName: 'Chưa bắt đầu',
              statusType: 'Đầu công việc',
            },
            parentId: 1,
            task: false,
          },
          {
            assignmentId: 4,
            assignmentName: 'Assignment 1.2',
            assigner: {
              accountId: 2,
              email: 'hunglengoc2109@gmail.com',
              user: {
                userId: 2,
                fullName: 'Trần Lê Hải',
                dob: '1999-03-01',
                gender: 'MALE',
                phoneNumber: '0394335205',
              },
              school: {
                schoolId: 1,
                schoolName: 'PGD VÀ ĐÀO TẠO',
                exactAddress: 'Quan Hoa, Cầu Giấy, Hà Nội',
                isActive: true,
              },
              roles: [
                {
                  roleId: 2,
                  roleName: 'Trưởng Phòng',
                  isSchoolEmployee: false,
                },
              ],
            },
            assignee: null,
            deadline: '2023-10-31T18:00:00',
            createdDate: '2023-11-02T20:01:33.664583',
            children: [
              {
                assignmentId: 5,
                assignmentName: 'Child Assignment 1.2.1',
                assigner: {
                  accountId: 2,
                  email: 'hunglengoc2109@gmail.com',
                  user: {
                    userId: 2,
                    fullName: 'Trần Lê Hải',
                    dob: '1999-03-01',
                    gender: 'MALE',
                    phoneNumber: '0394335205',
                  },
                  school: {
                    schoolId: 1,
                    schoolName: 'PGD VÀ ĐÀO TẠO',
                    exactAddress: 'Quan Hoa, Cầu Giấy, Hà Nội',
                    isActive: true,
                  },
                  roles: [
                    {
                      roleId: 2,
                      roleName: 'Trưởng Phòng',
                      isSchoolEmployee: false,
                    },
                  ],
                },
                assignee: null,
                deadline: '2023-11-05T10:00:00',
                createdDate: '2023-11-02T20:01:33.677221',
                children: [
                  {
                    assignmentId: 6,
                    assignmentName: 'Assignment grandchild 1.2 editted edtiion',
                    assigner: {
                      accountId: 2,
                      email: 'hunglengoc2109@gmail.com',
                      user: {
                        userId: 2,
                        fullName: 'Trần Lê Hải',
                        dob: '1999-03-01',
                        gender: 'MALE',
                        phoneNumber: '0394335205',
                      },
                      school: {
                        schoolId: 1,
                        schoolName: 'PGD VÀ ĐÀO TẠO',
                        exactAddress: 'Quan Hoa, Cầu Giấy, Hà Nội',
                        isActive: true,
                      },
                      roles: [
                        {
                          roleId: 2,
                          roleName: 'Trưởng Phòng',
                          isSchoolEmployee: false,
                        },
                      ],
                    },
                    assignee: null,
                    deadline: '2023-11-30T18:00:00',
                    createdDate: null,
                    children: [],
                    issueId: 1,
                    description:
                      'This is Assignment grandchild 1.2 editted edtiion',
                    status: {
                      statusId: 13,
                      statusName: 'Chưa bắt đầu',
                      statusType: 'Đầu công việc',
                    },
                    parentId: 5,
                    task: false,
                  },
                  {
                    assignmentId: 9,
                    assignmentName: 'Assignment grandchild 1.2 editted edtiion',
                    assigner: {
                      accountId: 2,
                      email: 'hunglengoc2109@gmail.com',
                      user: {
                        userId: 2,
                        fullName: 'Trần Lê Hải',
                        dob: '1999-03-01',
                        gender: 'MALE',
                        phoneNumber: '0394335205',
                      },
                      school: {
                        schoolId: 1,
                        schoolName: 'PGD VÀ ĐÀO TẠO',
                        exactAddress: 'Quan Hoa, Cầu Giấy, Hà Nội',
                        isActive: true,
                      },
                      roles: [
                        {
                          roleId: 2,
                          roleName: 'Trưởng Phòng',
                          isSchoolEmployee: false,
                        },
                      ],
                    },
                    assignee: null,
                    deadline: '2023-11-30T18:00:00',
                    createdDate: '2023-11-02T20:06:19.710791',
                    children: [],
                    issueId: 1,
                    description:
                      'This is Assignment grandchild 1.2 editted edtiion',
                    status: {
                      statusId: 13,
                      statusName: 'Chưa bắt đầu',
                      statusType: 'Đầu công việc',
                    },
                    parentId: 5,
                    task: false,
                  },
                ],
                issueId: 1,
                description: 'This is child assignment 1.2.1',
                status: {
                  statusId: 13,
                  statusName: 'Chưa bắt đầu',
                  statusType: 'Đầu công việc',
                },
                parentId: 4,
                task: false,
              },
            ],
            issueId: 1,
            description: 'This is assignment 1.2',
            status: {
              statusId: 13,
              statusName: 'Chưa bắt đầu',
              statusType: 'Đầu công việc',
            },
            parentId: 1,
            task: false,
          },
        ],
        issueId: 1,
        description: 'This is assignment 1',
        status: {
          statusId: 13,
          statusName: 'Chưa bắt đầu',
          statusType: 'Đầu công việc',
        },
        parentId: null,
        task: false,
      },
    ];
    console.log(this.assignments);

    // this.items = [
    //   {
    //     label: 'Thêm mới',
    //     icon: 'bi bi-plus-circle',
    //     command: (event) => this.viewFile(this.selectedFile!),
    //   },
    //   {
    //     label: 'Xóa',
    //     icon: 'bi bi-trash-fill',
    //     command: (event) => this.deleteContextMenu(),
    //   },
    // ];
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
  openDetail(assignment: any) {
    this.assignmentVisible = true;
    this.selectedAssignment = assignment;
    this.assignmentForm
      .get('assignmentName')
      ?.setValue(this.selectedAssignment.assignmentName);
    this.assignmentForm
      .get('description')
      ?.setValue(this.selectedAssignment.description);
    this.assignmentForm.get('date')?.setValue(this.selectedAssignment.deadline);
  }
  update() {
    this.assignmentVisible = false;
  }
}
