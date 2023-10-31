import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpHeaders} from "@angular/common/http";
import {InspectorService} from "../../../../services/inspector.service";
import {inspectionPlanService} from "../../../../services/inspectionplan.service";

@Component({
  selector: 'app-create-inspection-plan',
  templateUrl: './create-inspection-plan.component.html',
  styleUrls: ['./create-inspection-plan.component.scss']
})
export class CreateInspectionPlanComponent {
  inspectionPlanForm: FormGroup;
  tempInspectorList: any[] = [];
  tempInspectorIds: number[] = [];
  defaultEndDate: Date = new Date();
  defaultStartDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private readonly inspectionPlanService: inspectionPlanService
  ) {
  }

  ngOnInit() {
    this.inspectionPlanForm = this.fb.group({
      inspectionPlanName: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
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
    this.tempInspectorIds = this.tempInspectorList.map(inspector => inspector.accountId);
    this.inspectionPlanForm.get('inspectorIds')?.setValue(this.tempInspectorIds);
  }

  fileInputPlaceholders: string;

  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.setValue(file);
      this.fileInputPlaceholders = file.name;
    } else {
      this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.setValue(null);
    }
  }

  onSubmit() {
    const formData = new FormData();
    const inspectionPlan = {
      inspectionPlanName: this.inspectionPlanForm.get('inspectionPlanName')?.value,
      description: this.inspectionPlanForm.get('description')?.value,
      chiefId: 1,
      inspectorIds: this.inspectionPlanForm.get('inspectorIds')?.value,
      startDate: new Date(this.inspectionPlanForm.get('startDate')?.value).toISOString(),
      endDate: new Date(this.inspectionPlanForm.get('endDate')?.value).toISOString(),
      schoolId: this.inspectionPlanForm.get('schoolId')?.value,
      documentInspectionPlanDto: {
        documentName: this.inspectionPlanForm.get('documentInspectionPlanDto.documentName')?.value,
        documentCode: this.inspectionPlanForm.get('documentInspectionPlanDto.documentCode')?.value
      }
    }

    formData.append("request", new Blob([JSON.stringify(inspectionPlan)], {type: "application/json"}))
    const file = this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.value
    formData.append(`file`, file, file.name);

    console.log(inspectionPlan)

    this.inspectionPlanService.saveInspectionPlan(formData).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
