import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {IssueService} from "../../../../services/issue.service";
import {InspectionplanInspectorlistService} from "../../../../services/inspectionplan-inspectorlist.service";
import {Router} from "@angular/router";
import {ConfirmationService, ConfirmEventType} from "primeng/api";
import {ToastService} from "../../../../shared/toast/toast.service";
import {Subscription} from "rxjs";
import {TuiDay} from "@taiga-ui/cdk";
import {dateToTuiDay, tuiDayToDate} from "../../../../shared/util/util";

@Component({
  selector: 'app-create-inspection-plan',
  templateUrl: './create-inspection-plan.component.html',
  styleUrls: ['./create-inspection-plan.component.scss']
})
export class CreateInspectionPlanComponent implements OnInit, OnDestroy {
  inspectionPlanForm: FormGroup;
  minStartDate: TuiDay;
  maxStartDate: TuiDay;
  minEndDate: TuiDay;
  fileInputPlaceholders: string;
  schoolList: any[];
  inspectorList: any[];
  eligibleChiefList: any[];
  chiefList: any[];
  selectedInspectorList: any[] = [];
  createLoadingVisibility: boolean = false;
  createComplete: boolean = false;
  inspectorListIsValid: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly inspectionPlanService: inspectionPlanService,
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.inspectionplanInspectorService.setInspectorList(this.selectedInspectorList);
    const setInspectorList = this.inspectionplanInspectorService.inspectorList$.subscribe(list => this.selectedInspectorList = list);
    const setInspectorListValid = this.inspectionplanInspectorService.inspectorListIsValid$.subscribe(isValid => {
      this.inspectorListIsValid = isValid;
    });
    const getEligibleSchool =
      this.inspectionPlanService.getEligibleSchool().subscribe({
        next: (data) => {
          this.schoolList = data;
        },
        error: (error) => {
          this.toastService.showError('deleteInComplete', "Xóa không thành công", error.error.message);
        }
      })

    this.subscriptions.push(setInspectorList);
    this.subscriptions.push(setInspectorListValid);
    this.subscriptions.push(getEligibleSchool);

    let tomorow: Date = new Date();
    tomorow.setDate(tomorow.getDate() + 1);

    this.inspectionPlanForm = this.fb.group({
      inspectionPlanName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
      description: [null, Validators.compose([Validators.required])],
      chiefId: [null, Validators.compose([Validators.required])],
      inspectorIds: [[], Validators.compose([Validators.required])],
      startDate: [dateToTuiDay(tomorow), Validators.compose([Validators.required])],
      endDate: [dateToTuiDay(tomorow), Validators.compose([Validators.required])],
      schoolId: [null, Validators.compose([Validators.required])],
      documentInspectionPlanDto: this.fb.group({
        documentName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
        documentCode: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
        documentFile: [null, Validators.compose([Validators.required])]
      })
    })
    this.minEndDate = dateToTuiDay(tomorow);
    this.minStartDate = dateToTuiDay(tomorow);
    this.inspectionPlanForm.get('endDate')?.valueChanges.subscribe( x => {
      this.onEndDateChange();
    })
    this.inspectionPlanForm.get('startDate')?.valueChanges.subscribe( x => {
      this.onStartDateChange();
    })
    this.initInspectorList();
  }

  popupInspectorVisible: boolean = false;

  changeInspectorVisible() {
    this.popupInspectorVisible = !this.popupInspectorVisible;
  }

  initInspectorList() {
    let startDate = new Date(tuiDayToDate(this.inspectionPlanForm.get('startDate')?.value)).toISOString();
    let endDate = new Date(tuiDayToDate(this.inspectionPlanForm.get('endDate')?.value)).toISOString();
    const getEligibleInspector = this.inspectionPlanService.getEligibleInspector(startDate, endDate).subscribe({
      next: (data: any) => {
        console.log(data)
        this.inspectorList = data.inspectorDtos;
        this.chiefList = data.chiefDtos;
        this.inspectionplanInspectorService.setPopupInspectorList(this.inspectorList);
        const setPopUpList = this.inspectionplanInspectorService.popupInspectorList$.subscribe(list => this.inspectorList = list);
        this.subscriptions.push(setPopUpList);
      },
      error: (error) => {
        console.log(error)
      }
    });
    this.subscriptions.push(getEligibleInspector);
  }

  onResetList() {
    this.inspectionplanInspectorService.resetBothLists();
    this.inspectionplanInspectorService.setInspectorListIsValid(false);
  }

  getInspectorIds(data: any) {
    let inspectorListId = data.map((item: { accountId: any; }) => item.accountId);
    this.eligibleChiefList = data.filter((eligibleInspector: {
      accountId: number;
    }) => this.chiefList.some(inspector => inspector.accountId === eligibleInspector.accountId));
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
    if (this.selectedInspectorList.length > 0) {
      this.confirm1("Thay đổi thời gian kiểm tra sẽ xóa toàn bộ danh sách đoàn kiểm tra. Bạn có muốn tiếp tục", "Xác nhận");
    }
    this.minEndDate = this.inspectionPlanForm.get('startDate')?.value;
    this.initInspectorList();
  }

  onEndDateChange() {
    if (this.selectedInspectorList.length > 0) {
      this.confirm1("Thay đổi thời gian kiểm tra sẽ xóa toàn bộ danh sách đoàn kiểm tra. Bạn có muốn tiếp tục", "Xác nhận");
    }
    this.maxStartDate = this.inspectionPlanForm.get('endDate')?.value;
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
      reject: (type: ConfirmEventType) => {
      }
    });
  }

  resetInspectorList() {
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
    if (this.inspectionPlanForm.invalid) {
      this.inspectionPlanForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    const inspectionPlan = {
      inspectionPlanName: this.inspectionPlanForm.get('inspectionPlanName')?.value,
      description: this.inspectionPlanForm.get('description')?.value,
      chiefId: this.inspectionPlanForm.get('chiefId')?.value,
      inspectorIds: this.inspectionPlanForm.get('inspectorIds')?.value,
      startDate: new Date(tuiDayToDate(this.inspectionPlanForm.get('startDate')?.value)).toISOString(),
      endDate: new Date(tuiDayToDate(this.inspectionPlanForm.get('endDate')?.value)).toISOString(),
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

    const saveInspectionPlan = this.inspectionPlanService.saveInspectionPlan(formData).subscribe({
      next: (response) => {
        this.createComplete = true;
        setTimeout(() => {
          this.router.navigateByUrl("inspection-plan/" + response.inspectionPlan.inspectionPlanId);
        }, 1500);
      },
      error: (error) => {
        console.log(error)
      }
    })

    this.subscriptions.push(saveInspectionPlan);
  }

  private unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
