import { error } from '@angular/compiler-cli/src/transformers/util';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { AssignmentService } from 'src/app/services/assignment.service';
import { FileService } from 'src/app/services/file.service';
import { IssueService } from 'src/app/services/issue.service';
import { NoWhitespaceValidator } from 'src/app/shared/validators/no-white-space.validator';

@Component({
  selector: 'app-submit-assignment',
  templateUrl: './submit-assignment.component.html',
  styleUrls: ['./submit-assignment.component.scss'],
})
export class SubmitAssignmentComponent {
  assignments: any[];
  assVisible = false;
  fileVisible = false;
  assigneelist: any[];
  selectedAssignment: any;
  fileInputPlaceholders: string;
  selectedFiles: any[];
  selectedIndex: number;
  documents: any[] = [];
  comments: any[] = [];
  // newDocs: any[] = [];
  issueId: number;
  deleteDocIds: number[] = [];
  @ViewChild('fileInput') fileInput: any;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  isSubmit = false;
  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private issueService: IssueService,
    private assignmentService: AssignmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  fileInputForm = this.fb.group({
    documentCode: ['', NoWhitespaceValidator],
    documentName: ['', Validators.required],
    file: ['', Validators.required],
  });
  commentForm = this.fb.group({
    content: ['', Validators.required],
    userName: ['', Validators.required],
    createdDate: ['', Validators.required],
  });
  // inputFileForm = this.fb.group({
  //   documentName: ['', NoWhitespaceValidator()],
  //   documentCode: ['', NoWhitespaceValidator()],
  //   documentTypeId: 4,
  //   // deadline: [this.today, Validators.required],
  //   // isPasssed: [false, Validators.required],
  //   file: ['', Validators.required],
  // });
  addDocument() {
      this.fileVisible = true;
  }

  // get documents() {
  //   return this.filesForm.get('documents') as FormArray;
  // }
  uploadFiles() {
    this.fileVisible = false;
    const data = {
      documentCode: this.fileInputForm.get('documentCode')?.value,
      documentName: this.fileInputForm.get('documentName')?.value,
      file: this.fileInputForm.get('file')?.value,
    };
    console.log(data);
    this.documents.push(data);
    this.fileInputForm.reset();
    this.fileInputPlaceholders = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    console.log(this.documents);
    // GỌI ĐẾN API UPLOAD DOC LÊN HỆ THỐNG
  }
  filesForm: FormGroup;

  ngOnInit(): void {
    this.assignments = [
      {
        assignmentId: 77,
        assignmentName: 'Mẫu thư mục cho các trường năm học 2022-2023',
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
        assignee: {
          accountId: 7,
          email: 'hieutruong@gmail.com',
          user: {
            userId: 7,
            fullName: 'Hiệu Thị Trưởng',
            dob: '1999-03-01',
            gender: 'MALE',
            phoneNumber: '0394335205',
          },
          school: {
            schoolId: 2,
            schoolName: 'MN ÁNH SAO',
            exactAddress: 'CẦU GIẤY',
            isActive: true,
          },
          roles: [
            {
              roleId: 7,
              roleName: 'Hiệu Trưởng',
              isSchoolEmployee: true,
            },
          ],
        },
        listOfPossibleAssginees: [
          {
            accountId: 7,
            email: 'hieutruong@gmail.com',
            user: {
              userId: 7,
              fullName: 'Hiệu Thị Trưởng',
              dob: '1999-03-01',
              gender: 'MALE',
              phoneNumber: '0394335205',
            },
            school: {
              schoolId: 2,
              schoolName: 'MN ÁNH SAO',
              exactAddress: 'CẦU GIẤY',
              isActive: true,
            },
            roles: [
              {
                roleId: 7,
                roleName: 'Hiệu Trưởng',
                isSchoolEmployee: true,
              },
            ],
          },
        ],
        deadline: '2023-12-30T23:59:00',
        createdDate: '2023-11-12T19:21:30.350867',
        status: {
          statusId: 22,
          statusName: 'Chưa hoàn thành',
        },
        limitDocNumber: 3,
      },
      {
        assignmentId: 78,
        assignmentName: 'Mẫu thư mục cho các trường năm học 2022-2023',
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
        assignee: {
          accountId: 7,
          email: 'hieutruong@gmail.com',
          user: {
            userId: 7,
            fullName: 'Hiệu Thị Trưởng',
            dob: '1999-03-01',
            gender: 'MALE',
            phoneNumber: '0394335205',
          },
          school: {
            schoolId: 2,
            schoolName: 'MN ÁNH SAO',
            exactAddress: 'CẦU GIẤY',
            isActive: true,
          },
          roles: [
            {
              roleId: 7,
              roleName: 'Hiệu Trưởng',
              isSchoolEmployee: true,
            },
          ],
        },
        listOfPossibleAssginees: [
          {
            accountId: 7,
            email: 'hieutruong@gmail.com',
            user: {
              userId: 7,
              fullName: 'Hiệu Thị Trưởng',
              dob: '1999-03-01',
              gender: 'MALE',
              phoneNumber: '0394335205',
            },
            school: {
              schoolId: 2,
              schoolName: 'MN ÁNH SAO',
              exactAddress: 'CẦU GIẤY',
              isActive: true,
            },
            roles: [
              {
                roleId: 7,
                roleName: 'Hiệu Trưởng',
                isSchoolEmployee: true,
              },
            ],
          },
        ],
        deadline: '2023-12-30T23:59:00',
        createdDate: '2023-11-12T19:21:30.350867',
        status: {
          statusId: 22,
          statusName: 'Chưa hoàn thành',
        },
        limitDocNumber: 3,
      },
    ];
    // this.issueService
    //   .getCurrentActiveIssue()
    //   .pipe(
    //     switchMap((data) => {
    //       console.log(data);
    //       this.issueId = data.issueDto.issueId;

    //       return this.assignmentService.getAssignmentsToSubmit(
    //         data.issueDto.issueId
    //       );
    //     })
    //   )
    //   .subscribe((data) => {
    //     console.log('Đống data lấy về');
    //     console.log(data);
    //     this.assignments = data.assignmentListDtos;
    //     this.documents = data.assignmentListDtos.documents;
    //     console.log(this.assignments);
    //   });
  }
  assVisibleToggle(assignment: any) {
    this.assVisible = true;
    // console.log(assignment);
    // this.assignmentService
    //   .getAssignmentsById(assignment.assignmentId)
    //   .subscribe((data) => {
    //     this.selectedAssignment = data;
    //     this.documents = data.documents;
    //   });

    this.selectedAssignment = assignment;
  }
  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.fileInputPlaceholders = file.name;
      this.fileInputForm.get('file')?.setValue(file);
    }
  }
  submit() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn nộp công việc này?',
      header: 'Xác nhận nộp',
      icon: 'bi bi-exclamation-triangle-fill',
      accept: () => {
        const jsonData = {
          submitRequest: {
            assignmentId: this.selectedAssignment.assignmentId,
            isSubmit: true,
          },
        };
        this.selectedAssignment.status.statusId = 16;
        this.selectedAssignment.status.statusName = 'Chờ phê duyệt';
        console.log(jsonData);
        this.isSubmit = true;
        // this.assignmentService.submitAssignment(jsonData).subscribe({
        //   next: (data) => {
        //     console.log(data);
        //   },
        //   error: (error) => {
        //     console.log(error);
        //   },
        // });
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
          submitRequest: {
            assignmentId: this.selectedAssignment.assignmentId,
            isSubmit: false,
          },
        };
        this.selectedAssignment.status.statusId = 15;
        this.selectedAssignment.status.statusName = 'Đang tiến hành';
        this.isSubmit = false;
        // this.assignmentService.submitAssignment(jsonData).subscribe({
        //   next: (data) => {
        //     console.log(data);
        //   },
        //   error: (error) => {
        //     console.log(error);
        //   },
        // });
      },
      reject: (type: any) => {},
    });
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
  // getRelativeTimestamp(dateString: string): string {
  //   const commentTimestamp = new Date(dateString);
  //   const now = new Date();
  //   const timeDifference = now.getTime() - commentTimestamp.getTime();
  //   const secondsAgo = Math.floor(timeDifference / 1000);

  //   if (secondsAgo < 60) {
  //     return secondsAgo + 's ago';
  //   } else if (secondsAgo < 3600) {
  //     const minutesAgo = Math.floor(secondsAgo / 60);
  //     return minutesAgo + 'm ago';
  //   } else if (secondsAgo < 86400) {
  //     const hoursAgo = Math.floor(secondsAgo / 3600);
  //     return hoursAgo + 'h ago';
  //   } else {
  //     const daysAgo = Math.floor(secondsAgo / 86400);
  //     return daysAgo + 'd ago';
  //   }
  // }
  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.fileService.readIssuePDF(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    });
  }
  displayNewFileUpload(file: File) {
    const blobUrl = window.URL.createObjectURL(file as Blob);
    this.pdfUrl = blobUrl;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.pdfLoaded = true;
  }
  removeDoc(index: number) {
    this.documents.splice(index, 1);
    this.deleteDocIds.push(index);
    // GỌI ĐẾN API XÓA TÀI LIỆU
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
