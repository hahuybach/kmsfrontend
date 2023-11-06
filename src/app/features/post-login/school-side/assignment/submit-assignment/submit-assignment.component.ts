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
  assigneelist: any[];
  selectedAssignment: any;
  fileInputPlaceholders: string;
  selectedFiles: any[];
  constructor(private fb: FormBuilder) {
    this.filesForm = this.fb.group({
      documents: this.fb.array([]),
    });
  }
  // inputFileForm = this.fb.group({
  //   documentName: ['', NoWhitespaceValidator()],
  //   documentCode: ['', NoWhitespaceValidator()],
  //   documentTypeId: 4,
  //   // deadline: [this.today, Validators.required],
  //   // isPasssed: [false, Validators.required],
  //   file: ['', Validators.required],
  // });
  addDocument() {
    const documentForm = this.fb.group({
      documentCode: ['', Validators.required],
      documentName: ['', Validators.required],
      file: [null, Validators.required],
    });

    this.documents.push(documentForm);
  }

  removeDocument(index: number) {
    this.documents.removeAt(index);
  }

  get documents() {
    return this.filesForm.get('documents') as FormArray;
  }
  onSubmitFile(event: any, index: number) {
    if (!this.selectedFiles) {
      this.selectedFiles = []; // Initialize the selectedFiles array if it's not already defined
    }
    this.selectedFiles[index] = event.target.files[0];
    this.documents.at(index).patchValue({
      isExist: false,
    });
  }
  uploadFiles(){
    
  }
  filesForm: FormGroup;

  ngOnInit(): void {
    this.addDocument();
    console.log(this.filesForm.value);

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
          assignerName: 'bach 2',
        },
        deadline: '10/11/2002',
        comments: [
          {
            userName: 'Hà Huy Bách',
            content: 'Em làm lại đi nhé',
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
  // handleFileInputChange(fileInput: any): void {
  //   const files = fileInput.files;
  //   if (files.length > 0) {
  //     const file = files[0];
  //     this.inputFileForm.get('file')?.setValue(file);
  //     this.fileInputPlaceholders = file.name;
  //   }
  // }
}
