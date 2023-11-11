import { error } from '@angular/compiler-cli/src/transformers/util';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private issueService: IssueService,
    private assignmentService: AssignmentService
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
    // this.newDocs.push(data);
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
        console.log(data);
        this.assignments = data.assignmentListDtos;
        this.documents = data.assignmentListDtos.documents;
        console.log(this.assignments);
      });
    // this.documents = [
    //   {
    //     documentName:
    //       'DataTable requires a collection to display along with column',
    //     documentCode: '123',
    //     file: {},
    //   },
    // ];
  }
  assVisibleToggle(assignment: any) {
    this.assVisible = true;
    console.log(assignment);
    this.assignmentService
      .getAssignmentsById(assignment.assignmentId)
      .subscribe((data) => {
        this.selectedAssignment = data;
        this.documents = data.documents;
      });

    // this.selectedAssignment = assignment;
  }
  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.fileInputPlaceholders = file.name;
      this.fileInputForm.get('file')?.setValue(file);
    }
  }
  sendFiles() {
    const newDocs: any[] = [];
    for (let index = 0; index < this.documents.length; index++) {
      if (this.documents[index].documentId == null) {
        newDocs.push(this.documents[index]);
      }
    }
    const docs = newDocs.map(({ file, ...rest }) => rest);
    const files = newDocs.map((item) => item.file);
    const formData = new FormData();
    const jsonData = {
      assignmentId: this.selectedAssignment.assignmentId,
      documents: docs,
      deleteDocIds: [],
    };
    this.selectedAssignment.status.statusId = 16;
    this.selectedAssignment.status.statusName = 'Chờ phê duyệt';
    console.log(jsonData);
    formData.append(
      'task',
      new Blob([JSON.stringify(jsonData)], {
        type: 'application/json',
      })
    );
    for (let i = 0; i <= files.length; i++) {
      formData.append(`files`, files[i]);
    }
    // console.log(this.documents);
    // console.log(jsonData);
    this.assignmentService.submitAssignment(formData).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
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
