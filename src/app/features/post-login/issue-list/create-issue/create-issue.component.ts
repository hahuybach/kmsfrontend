import {Component, OnInit} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss']
})
export class CreateIssueComponent implements OnInit {
  issueForm: FormGroup;
  docList: FormArray;

  get issueDocumentFormGroup() {
    return this.issueForm.get('issueDocument') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.issueForm = this.fb.group({
      issueName: [null, Validators.compose([Validators.required])],
      issueDetail: [null, Validators.compose([Validators.required])],
      issueDocument: this.fb.array([this.createDoc()])
    })

    this.docList = this.issueForm.get('issueDocument') as FormArray;
  }

  createDoc(): FormGroup {
    return this.fb.group({
      docName: [null, Validators.compose([Validators.required])],
      docCode: [null, Validators.compose([Validators.required])],
      docFile: [null,]
    })
  }

  addIssueDoc() {
    this.docList.push(this.createDoc());
  }

  removeIssueDoc(index: number) {
    this.docList.removeAt(index);
  }

  fileInputPlaceholders: string[] = [];

  handleFileInputChange(fileInput: any, index: number): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      console.log(file.name);
      this.issueDocumentFormGroup.controls[index].get('docFile')?.setValue(file);

      this.fileInputPlaceholders[index] = file.name;
    } else {
      this.issueDocumentFormGroup.controls[index].get('docFile')?.setValue(null);
    }
  }

  createIssue(){
    console.log(this.issueForm.get('issueName')?.value);
    console.log(this.issueForm.get('issueDetail')?.value);
    console.log(this.issueForm.get('issueDocument')?.value);
  }
}
