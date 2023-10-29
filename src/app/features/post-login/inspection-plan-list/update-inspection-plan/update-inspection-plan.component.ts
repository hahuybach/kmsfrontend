import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-update-inspection-plan',
  templateUrl: './update-inspection-plan.component.html',
  styleUrls: ['./update-inspection-plan.component.scss']
})
export class UpdateInspectionPlanComponent {
  inspectionPlanForm: FormGroup;
  defaultEndDate:Date = new Date();
  defaultStartDate:Date = new Date();

  popupInspectorVisible:boolean = false;

  changeInspectorVisible(){
    this.popupInspectorVisible = !this.popupInspectorVisible;
  }

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.inspectionPlanForm = this.fb.group({
      inspectionPlanName: [null, Validators.compose([Validators.required])],
      inspectionPlanDescription: [null, Validators.compose([Validators.required])],
      chiefId:[0, Validators.compose([Validators.required])],
      inspectorIds:[[], Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      schoolId:[0, Validators.compose([Validators.required])],
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


  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      console.log(file.name);
      this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.setValue(file);
    } else {
      this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.setValue(null);
    }
  }
}
