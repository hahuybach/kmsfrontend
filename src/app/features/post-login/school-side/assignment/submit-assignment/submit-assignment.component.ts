import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(private fb: FormBuilder) {}
  fileInputForm = this.fb.group({
    documentCode: ['', Validators.required],
    documentName: ['', Validators.required],
    file: [null, Validators.required],
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
        assignmentName: 'assignment name 1',
        description: 'des 1',
        assignee: {
          assigneeId: 1,
          assigneeName: 'bach',
        },
        assigner: {
          assignerId: 2,
          assignerName: 'Nguyễn Văn A',
        },
        deadline: '10/11/2002',
        comments: [
          {
            userName: 'Hà Huy Bách',
            content: 'Em làm lại đi nhé',
            createdDate: '2023-11-06T12:00:00',
          },
        ],
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
  getRelativeTimestamp(dateString: string): string {
    const commentTimestamp = new Date(dateString);
    const now = new Date();
    const timeDifference = now.getTime() - commentTimestamp.getTime();
    const secondsAgo = Math.floor(timeDifference / 1000);

    if (secondsAgo < 60) {
      return secondsAgo + 's ago';
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return minutesAgo + 'm ago';
    } else if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      return hoursAgo + 'h ago';
    } else {
      const daysAgo = Math.floor(secondsAgo / 86400);
      return daysAgo + 'd ago';
    }
  }
}
