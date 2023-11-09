import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileService } from 'src/app/services/file.service';
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
  @ViewChild('fileInput') fileInput: any;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private sanitizer: DomSanitizer
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

  removeDocument(index: number) {
    console.log('runhere');
    // this.documents.removeAt(index);
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
  }
  filesForm: FormGroup;

  ngOnInit(): void {
    // this.addDocument();
    // console.log(this.filesForm.value);
    // this.filesForm = this.fb.group({
    //   documents: this.fb.array([]),
    // });
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
          statusName: 'Chờ phê duyệt',
          statusType: 'string',
        },
        parentId: 0,
        progress: 0,
        task: true,
      },
    ];
    this.assigneelist = [
      {
        assigneeId: 1,
        assigneeName: 'bach',
      },
      {
        assigneeId: 2,
        assigneeName: 'an',
      },
    ];
    this.documents = [
      {
        documentName:
          'DataTable requires a collection to display along with column',
        documentCode: '123',
        file: {},
      },
    ];
  }
  assVisibleToggle(assignment: any) {
    this.assVisible = true;
    console.log(assignment);
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
