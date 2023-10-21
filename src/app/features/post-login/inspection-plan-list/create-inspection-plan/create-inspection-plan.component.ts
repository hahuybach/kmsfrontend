import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-inspection-plan',
  templateUrl: './create-inspection-plan.component.html',
  styleUrls: ['./create-inspection-plan.component.scss']
})
export class CreateInspectionPlanComponent {
  inspectionPlanForm: FormGroup;
  docList: FormArray;

  defaultEndDate:Date = new Date();
  defaultStartDate:Date = new Date();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
  }

  get inspectionPlanDocumentFormArray() {
    return this.inspectionPlanForm.get('inspectionPlanDocument') as FormArray;
  }
  ngOnInit() {
    this.inspectionPlanForm = this.fb.group({
      inspectionPlanName: [null, Validators.compose([Validators.required])],
      inspectionPlanDescription: [null, Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      schoolId:[0, Validators.compose([Validators.required])],
      inspectionPlanDocument: this.fb.array([this.createDoc()])
    })
    this.docList = this.inspectionPlanForm.get('inspectionPlanDocument') as FormArray;

    this.defaultStartDate.setDate(this.defaultStartDate.getDate() - 1);
    this.inspectionPlanForm.get('startDate')?.setValue(this.defaultStartDate.toISOString().split('T')[0]);
    this.inspectionPlanForm.get('endDate')?.setValue(this.defaultEndDate.toISOString().split('T')[0]);
  }

  createDoc(): FormGroup {
    return this.fb.group({
      documentName: [null, Validators.compose([Validators.required])],
      documentCode: [null, Validators.compose([Validators.required])],
      documentTypeId: [null],
      documentFile: [null, Validators.compose([Validators.required])]
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
      this.inspectionPlanDocumentFormArray.controls[index].get('documentFile')?.setValue(file);

      this.fileInputPlaceholders[index] = file.name;
    } else {
      this.inspectionPlanDocumentFormArray.controls[index].get('documentFile')?.setValue(null);
    }
  }
}
