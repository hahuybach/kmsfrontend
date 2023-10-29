import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-inspection-plan',
  templateUrl: './create-inspection-plan.component.html',
  styleUrls: ['./create-inspection-plan.component.scss']
})
export class CreateInspectionPlanComponent {
  inspectionPlanForm: FormGroup;
  tempInspectorList:any[] = [];
  defaultEndDate: Date = new Date();
  defaultStartDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.inspectionPlanForm = this.fb.group({
      inspectionPlanName: [null, Validators.compose([Validators.required])],
      inspectionPlanDescription: [null, Validators.compose([Validators.required])],
      chiefId: [0, Validators.compose([Validators.required])],
      inspectorIds: [[], Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      schoolId: [0, Validators.compose([Validators.required])],
      documentInspectionPlanDto: this.fb.group({
        documentName: [null, Validators.compose([Validators.required])],
        documentCode: [null, Validators.compose([Validators.required])],
        documentFile: [null, Validators.compose([Validators.required])]
      })
    })

    this.defaultStartDate.setDate(this.defaultStartDate.getDate() - 1);
    this.inspectionPlanForm.get('startDate')?.setValue(this.defaultStartDate.toISOString().split('T')[0]);
    this.inspectionPlanForm.get('endDate')?.setValue(this.defaultEndDate.toISOString().split('T')[0]);
  }

  popupInspectorVisible: boolean = false;

  changeInspectorVisible() {
    this.popupInspectorVisible = !this.popupInspectorVisible;
  }

  getInspectorList(data: any) {
    this.tempInspectorList = data;
    console.log(this.tempInspectorList)
  }

  fileInputPlaceholders: string;

  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      console.log(file.name);
      this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.setValue(file);

      this.fileInputPlaceholders = file.name;
    } else {
      this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.setValue(null);
    }
  }
}
