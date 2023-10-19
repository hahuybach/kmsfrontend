import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss']
})


export class CreateIssueComponent implements OnInit {
  docTypes_select_1 = [
    {
      id: 1,
      name: "Kế hoạch công tác kiểm tra năm học",
    },
    {
      id: 2,
      name: "Hướng dẫn công tác KTNB",
    },
    {
      id: 3,
      name: "Quyết định thành lập BKTB",
    }
  ]
  docTypes_select_2 = [
    {
      id: 1,
      name: "Kế hoạch công tác kiểm tra năm học",
    },
    {
      id: 2,
      name: "Hướng dẫn công tác KTNB",
    },
    {
      id: 3,
      name: "Quyết định thành lập BKTB",
    }
  ]
  docTypes_select_3 = [
    {
      id: 1,
      name: "Kế hoạch công tác kiểm tra năm học",
    },
    {
      id: 2,
      name: "Hướng dẫn công tác KTNB",
    },
    {
      id: 3,
      name: "Quyết định thành lập BKTB",
    }
  ]

  selectedValue_1: any;
  selectedValue_2: any;
  selectedValue_3: any;


  onChange1(e: any) {
    this.selectedValue_1 = e.target.value;

  };

  onChange2(e: any) {
    this.selectedValue_2 = e.target.value;

  };

  onChange3(e: any) {
    this.selectedValue_3 = e.target.value;
  };

  issueForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    protected http: HttpClient
  ) {
  }

  ngOnInit() {
    this.issueForm = this.fb.group({
      issueName: [null, Validators.compose([Validators.required])],
      issueDetail: [null, Validators.compose([Validators.required])],
      issueDocList: this.fb.group({
        issueDoc_1: this.fb.group({
          documentName: [null, Validators.compose([Validators.required])],
          documentTypeId: [0, Validators.compose([Validators.required])],
          documentCode: [null, Validators.compose([Validators.required])],
          documentFile: [null, Validators.compose([Validators.required])]
        }),
        issueDoc_2: this.fb.group({
          documentName: [null, Validators.compose([Validators.required])],
          documentTypeId: [0, Validators.compose([Validators.required])],
          documentCode: [null, Validators.compose([Validators.required])],
          documentFile: [null, Validators.compose([Validators.required])]
        }),
        issueDoc_3: this.fb.group({
          documentName: [null, Validators.compose([Validators.required])],
          documentTypeId: [0, Validators.compose([Validators.required])],
          documentCode: [null, Validators.compose([Validators.required])],
          documentFile: [null, Validators.compose([Validators.required])]
        })
      })
    })
    this.fileInputPlaceholders = ['', '', ''];
  }

  fileInputPlaceholders: string[] = [];

  handleFileInputChange(fileInput: any, position: number): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      switch (position) {
        case 1:
          this.issueForm.get("issueDocList.issueDoc_1.documentFile")?.setValue(file);
          this.fileInputPlaceholders[0] = file.name;
          break;
        case 2:
          this.issueForm.get("issueDocList.issueDoc_2.documentFile")?.setValue(file);
          this.fileInputPlaceholders[1] = file.name;
          break;
        case 3:
          this.issueForm.get("issueDocList.issueDoc_3.documentFile")?.setValue(file);
          this.fileInputPlaceholders[2] = file.name;
          break;
      }
    } else {
      this.fileInputPlaceholders[position - 1] = '';
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append("issueName", this.issueForm.get("issueName")?.value);
    formData.append("description", this.issueForm.get("issueDetail")?.value);

    const documentIssues: any = [];

    for (let i = 1; i <= 3; i++) {
      const docFileControl = this.issueForm.get(`issueDocList.issueDoc_${i}.docFile`);
      if (docFileControl?.value) {
        const docFile = docFileControl.value;
        formData.append(`documentIssues[${i - 1}].documentFile`, docFile, docFile.name);

        const documentName = this.issueForm.get(`issueDocList.issueDoc_${i}.docName`)?.value;
        const documentType = this.issueForm.get(`issueDocList.issueDoc_${i}.docType`)?.value;
        const documentCode = this.issueForm.get(`issueDocList.issueDoc_${i}.docCode`)?.value;

        documentIssues.push({
          documentName,
          documentType,
          documentCode,
        });
      }

      formData.append('documentIssues', JSON.stringify(documentIssues));


      this.http.post('http://localhost:8080/api/v1/document/upload/file', formData).subscribe(
        (response) => {
          console.log('Form data sent to the backend:', response);
        },
        (error) => {
          console.error('Error while sending form data:', error);
        }
      );
    }
  }
}


