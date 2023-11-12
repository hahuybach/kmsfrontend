import {Component} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpHeaders} from "@angular/common/http";
import {InspectorService} from "../../../../services/inspector.service";
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {SchoolService} from "../../../../services/school.service";
import {IssueService} from "../../../../services/issue.service";
import {InspectionplanInspectorlistService} from "../../../../services/inspectionplan-inspectorlist.service";

@Component({
  selector: 'app-create-inspection-plan',
  templateUrl: './create-inspection-plan.component.html',
  styleUrls: ['./create-inspection-plan.component.scss']
})
export class CreateInspectionPlanComponent {
  inspectionPlanForm: FormGroup;
  defaultEndDate: Date = new Date();
  defaultStartDate: Date = new Date();
  fileInputPlaceholders: string;
  schoolList: any[];
  inspectorList: any[];
  inspectorListId: number[];
  selectedInspectorList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly inspectionPlanService: inspectionPlanService,
    private readonly schoolService: SchoolService,
    private readonly issueService: IssueService,
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService
  ) {
  }

  ngOnInit() {
    this.issueService.getCurrentActiveIssue().subscribe({
        next: (data) => {
          this.inspectorList = data.issueDto.inspectors;
          this.inspectionplanInspectorService.setPopupInspectorList(this.inspectorList);
          this.inspectionplanInspectorService.popupInspectorList$.subscribe(list => this.inspectorList = list);
          this.inspectionplanInspectorService.setInspectorList(this.selectedInspectorList);
          this.inspectionplanInspectorService.inspectorList$.subscribe(list => this.selectedInspectorList = list);
        },
        error: (error): any => {
          console.log(error);
        }
      }
    )

    this.schoolService.getSchools().subscribe({
      next: (data) => {
        this.schoolList = data;
      },
      error: (error) => {
        console.log(error);
      }
    })

    this.inspectionPlanForm = this.fb.group({
      inspectionPlanName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
      description: [null, Validators.compose([Validators.required])],
      chiefId: [0, Validators.compose([Validators.required])],
      inspectorIds: [[], Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      schoolId: [0, Validators.compose([Validators.required])],
      documentInspectionPlanDto: this.fb.group({
        documentName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
        documentCode: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
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

  onResetList() {
    this.inspectionplanInspectorService.resetBothLists();
  }

  getInspectorIds(data: any) {
    this.inspectorListId = data.map((item: { accountId: any; }) => item.accountId);
    console.log(this.inspectorListId)
  }

  get documentNameControls() {
    return (this.inspectionPlanForm.get('documentInspectionPlanDto') as FormGroup).controls['documentName'];
  }

  get documentCodeControls() {
    return (this.inspectionPlanForm.get('documentInspectionPlanDto') as FormGroup).controls['documentCode'];
  }

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
    console.log("submit")
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
