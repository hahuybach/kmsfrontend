import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {IssueService} from "../../../../services/issue.service";
import {InspectionplanInspectorlistService} from "../../../../services/inspectionplan-inspectorlist.service";
import {Router} from "@angular/router";
import {ConfirmationService, ConfirmEventType} from "primeng/api";

@Component({
  selector: 'app-create-inspection-plan',
  templateUrl: './create-inspection-plan.component.html',
  styleUrls: ['./create-inspection-plan.component.scss']
})
export class CreateInspectionPlanComponent {
  inspectionPlanForm: FormGroup;
  defaultEndDate: Date = new Date();
  defaultStartDate: Date = new Date();
  minStartDate: string;
  maxStartDate: string;
  minEndDate: string;
  fileInputPlaceholders: string;
  schoolList: any[];
  inspectorList: any[];
  eligibleChiefList: any[];
  chiefList: any[];
  selectedInspectorList: any[] = [];
  createLoadingVisibility: boolean = false;
  createComplete: boolean = false;

  constructor(
    private fb: FormBuilder,
    private readonly inspectionPlanService: inspectionPlanService,
    private readonly issueService: IssueService,
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService,
    private readonly router: Router,
    private readonly confirmationService : ConfirmationService,
  ) {
  }

  ngOnInit() {
    this.inspectionplanInspectorService.setInspectorList(this.selectedInspectorList);
    this.inspectionplanInspectorService.inspectorList$.subscribe(list => this.selectedInspectorList = list);

    this.inspectionPlanService.getEligibleSchool().subscribe({
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
      chiefId: [null, Validators.compose([Validators.required])],
      inspectorIds: [[], Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      schoolId: [null, Validators.compose([Validators.required])],
      documentInspectionPlanDto: this.fb.group({
        documentName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
        documentCode: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
        documentFile: [null, Validators.compose([Validators.required])]
      })
    })
    this.defaultStartDate.setDate(this.defaultStartDate.getDate() + 1);
    this.defaultEndDate.setDate(this.defaultStartDate.getDate() + 1);
    this.minStartDate = this.defaultStartDate.toISOString().slice(0, 10);
    this.minEndDate = this.defaultEndDate.toISOString().slice(0, 10);
    this.maxStartDate = this.defaultEndDate.toISOString().slice(0, 10);
    this.inspectionPlanForm.get('startDate')?.setValue(this.defaultStartDate.toISOString().split('T')[0]);
    this.inspectionPlanForm.get('endDate')?.setValue(this.defaultEndDate.toISOString().split('T')[0]);
    this.initInspectorList();
  }

  popupInspectorVisible: boolean = false;

  changeInspectorVisible() {
    this.popupInspectorVisible = !this.popupInspectorVisible;
  }

  initInspectorList() {
    let startDate =   new Date(this.inspectionPlanForm.get('startDate')?.value).toISOString();
    let endDate =   new Date(this.inspectionPlanForm.get('endDate')?.value).toISOString();
    this.inspectionPlanService.getEligibleInspector(startDate, endDate).subscribe({
      next: (data:any) => {
        console.log(data)
        this.inspectorList = data.inspectorDtos;
        this.chiefList = data.chiefDtos;
        this.inspectionplanInspectorService.setPopupInspectorList(this.inspectorList);
        this.inspectionplanInspectorService.popupInspectorList$.subscribe(list => this.inspectorList = list);
      },
      error: (error) =>{
        console.log(error)
      }
    });
  }

  onResetList() {
    this.inspectionplanInspectorService.resetBothLists();
  }

  getInspectorIds(data: any) {
    let inspectorListId = data.map((item: { accountId: any; }) => item.accountId);
    this.eligibleChiefList = data.filter((eligibleInspector: { accountId: number; }) => this.chiefList.some(inspector => inspector.accountId === eligibleInspector.accountId));
    this.inspectionPlanForm.get('inspectorIds')?.setValue(inspectorListId);
  }

  get documentNameControls() {
    return (this.inspectionPlanForm.get('documentInspectionPlanDto') as FormGroup).controls['documentName'];
  }

  get documentCodeControls() {
    return (this.inspectionPlanForm.get('documentInspectionPlanDto') as FormGroup).controls['documentCode'];
  }

  get documentFileControls() {
    return (this.inspectionPlanForm.get('documentInspectionPlanDto') as FormGroup).controls['documentFile'];
  }

  onStartDateChange() {
    if (this.selectedInspectorList.length > 0){
      this.confirm1("Thay đổi thời gian kiểm tra sẽ xóa toàn bộ danh sách đoàn kiểm tra. Bạn có muốn tiếp tục", "Xác nhận");
    }
    this.minEndDate =  new Date(this.inspectionPlanForm.get('startDate')?.value).toISOString().slice(0, 10);
    this.initInspectorList();
  }

  onEndDateChange() {
    if (this.selectedInspectorList.length > 0){
      this.confirm1("Thay đổi thời gian kiểm tra sẽ xóa toàn bộ danh sách đoàn kiểm tra. Bạn có muốn tiếp tục", "Xác nhận");
    }
    this.maxStartDate = new Date(this.inspectionPlanForm.get('endDate')?.value).toISOString().slice(0, 10);
    this.initInspectorList();
  }

  confirm1(message: string, header: string) {
    this.confirmationService.confirm({
      message: message,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.resetInspectorList()
      },
      reject: (type : ConfirmEventType) => {
      }
    });
  }

  resetInspectorList(){
    this.eligibleChiefList = [];
    this.selectedInspectorList = [];
    this.chiefList = [];
    this.inspectorList = [];
    this.initInspectorList();
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
    if (this.inspectionPlanForm.invalid){
      this.inspectionPlanForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    const inspectionPlan = {
      inspectionPlanName: this.inspectionPlanForm.get('inspectionPlanName')?.value,
      description: this.inspectionPlanForm.get('description')?.value,
      chiefId: this.inspectionPlanForm.get('chiefId')?.value,
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

    this.createLoadingVisibility = true;

    this.inspectionPlanService.saveInspectionPlan(formData).subscribe({
      next: (response) => {
        this.createComplete = true;
        setTimeout(() => {
          this.router.navigateByUrl("inspection_plan/" + response.inspectionPlan.inspectionPlanId);
        }, 1500);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
