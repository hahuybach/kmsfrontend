import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {IssueService} from "../../../../services/issue.service";
import {InspectionplanInspectorlistService} from "../../../../services/inspectionplan-inspectorlist.service";
import {Router} from "@angular/router";
import {ConfirmationService, ConfirmEventType, MenuItem} from "primeng/api";
import {ToastService} from "../../../../shared/toast/toast.service";
import {Subscription} from "rxjs";
import {TuiDay} from "@taiga-ui/cdk";
import {dateToTuiDay, tuiDayToDate} from "../../../../shared/util/util";
import {NoWhitespaceValidator} from "../../../../shared/validators/no-white-space.validator";

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
  createFailed: boolean = false;
  inspectorListIsValid: boolean = false;
  duplicateDocumentCode: boolean = false;
  loadingInspector: boolean = false;
  loadingInspectorComplete: boolean = false;
  breadCrumb = [
    {
      caption: 'Trang chủ',
      routerLink: '/',
    },
    {
      caption: 'Danh sách kế hoạch thanh tra',
      routerLink: '/inspection-plan/list',
    },
    {
      caption: 'Tạo mới kế hoạch thanh tra'
    },
  ];

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

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  activeIndex: number = 0;
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Thông tin',
      },
      {
        label: 'Danh sách thanh tra',
      }
    ];

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
          this.toastService.showError('deleteInComplete', "Lỗi danh sách trường", error.error.message);
        }
      })

    this.subscriptions.push(setInspectorList);
    this.subscriptions.push(setInspectorListValid);
    this.subscriptions.push(getEligibleSchool);

    let tomorow: Date = new Date();
    tomorow.setDate(tomorow.getDate() + 1);

    this.inspectionPlanForm = this.fb.group({
      inspectionPlanName: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
      description: [null, Validators.compose([NoWhitespaceValidator(), Validators.required])],
      chiefId: [null, Validators.compose([Validators.required])],
      inspectorIds: [[], Validators.compose([Validators.required])],
      startDate: [dateToTuiDay(tomorow), Validators.compose([Validators.required])],
      endDate: [dateToTuiDay(tomorow), Validators.compose([Validators.required])],
      schoolId: [null, Validators.compose([Validators.required])],
      documentInspectionPlanDto: this.fb.group({
        documentName: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
        documentCode: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
        documentFile: [null, Validators.compose([Validators.required])]
      })
    })
    this.minEndDate = dateToTuiDay(tomorow);
    this.minStartDate = dateToTuiDay(tomorow);
  }

  popupInspectorVisible: boolean = false;

  changeInspectorVisible() {
    this.popupInspectorVisible = !this.popupInspectorVisible;
  }

  initInspectorList() {
    this.loadingInspector = true;
    let startDate = new Date(tuiDayToDate(this.inspectionPlanForm.get('startDate')?.value)).toISOString();
    let endDate = new Date(tuiDayToDate(this.inspectionPlanForm.get('endDate')?.value)).toISOString();
    let schoolId = this.inspectionPlanForm.get('schoolId')?.value;
    const getEligibleInspector = this.inspectionPlanService.getEligibleInspectorForCreate(startDate, endDate, schoolId).subscribe({
      next: (data: any) => {
        this.inspectorList = data.inspectorDtos;
        this.chiefList = data.chiefDtos;
        this.inspectionplanInspectorService.setPopupInspectorList(this.inspectorList);
        const setPopUpList = this.inspectionplanInspectorService.popupInspectorList$.subscribe(list => this.inspectorList = list);
        this.loadingInspector = false;
        this.subscriptions.push(setPopUpList);
      },
      error: (error) => {
        this.toastService.showError('deleteInComplete', "Lỗi danh sách thanh tra", error.error.message);
      }
    });
    this.subscriptions.push(getEligibleInspector);
  }

  onResetList() {
    this.inspectionplanInspectorService.resetBothLists();
  }

  getInspectorIds(data: any) {
    let inspectorListId = data.map((item: { accountId: any; }) => item.accountId);
    this.eligibleChiefList = data.filter((eligibleInspector: {
      accountId: number;
    }) => this.chiefList.some(inspector => inspector.accountId === eligibleInspector.accountId));
    this.inspectionPlanForm.get('inspectorIds')?.setValue(inspectorListId);
    if (!inspectorListId.includes(this.inspectionPlanForm.get('chiefId')?.value)){
      this.inspectionPlanForm.get('chiefId')?.setValue(null);
    }
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

  // onNextButton(){
  //   this.initInspectorList()
  //   this.activeIndex = 1;
  // }

  onNextButton() {
    if (
      this.inspectionPlanForm.get('inspectionPlanName')?.valid &&
      this.inspectionPlanForm.get('description')?.valid &&
      this.inspectionPlanForm.get('schoolId')?.valid &&
      this.inspectionPlanForm.get('documentInspectionPlanDto')?.valid
    ) {
      this.initInspectorList();
      this.activeIndex = 1;
    } else {
      this.inspectionPlanForm.get('inspectionPlanName')?.markAllAsTouched();
      this.inspectionPlanForm.get('description')?.markAllAsTouched();
      this.inspectionPlanForm.get('schoolId')?.markAllAsTouched();
      this.inspectionPlanForm.get('documentInspectionPlanDto')?.markAllAsTouched();
    }
  }

  onBackButton() {
    this.activeIndex = 0;
  }

  onStartDateChange() {
    if (this.selectedInspectorList.length > 0) {
      this.confirmationService.confirm({
        message: 'Thay đổi thời gian sẽ xóa danh sách đoàn kiểm tra. Bạn có muốn tiếp tục?',
        header: 'Xác nhận thay đổi',
        key: 'changeTime',
        icon: 'bi bi-exclamation-triangle',
        accept: () => {
          this.resetInspectorList()
          this.minEndDate = this.inspectionPlanForm.get('startDate')?.value;
          this.initInspectorList();
        },
        reject: (type: ConfirmEventType) => {
          return;
        }
      });
    }else {
      this.minEndDate = this.inspectionPlanForm.get('startDate')?.value;
      this.initInspectorList();
    }
  }

  onSchoolIdChange() {
    if (this.selectedInspectorList.length > 0) {
      this.confirmationService.confirm({
        message: 'Thay trường sẽ xóa danh sách đoàn kiểm tra. Bạn có muốn tiếp tục?',
        header: 'Xác nhận thay đổi',
        key: 'changeTime',
        icon: 'bi bi-exclamation-triangle',
        accept: () => {
          this.resetInspectorList()
          this.initInspectorList();
        },
        reject: (type: ConfirmEventType) => {
          return;
        }
      });
    }else {
      this.initInspectorList();
    }
  }

  onEndDateChange() {
    if (this.selectedInspectorList.length > 0) {
      this.confirmationService.confirm({
        message: 'Thay đổi thời gian sẽ xóa danh sách đoàn kiểm tra. Bạn có muốn tiếp tục?',
        header: 'Xác nhận thay đổi',
        key: 'changeTime',
        icon: 'bi bi-exclamation-triangle',
        accept: () => {
          this.resetInspectorList();
          this.maxStartDate = this.inspectionPlanForm.get('endDate')?.value;
          this.initInspectorList();
        },
        reject: (type: ConfirmEventType) => {
          return;
        }
      });
    }else {
      this.maxStartDate = this.inspectionPlanForm.get('endDate')?.value;
      this.initInspectorList();
    }
  }


  resetInspectorList() {
    this.inspectionPlanForm.get('chiefId')?.setValue(null);
    this.inspectionPlanForm.get('inspectorIds')?.setValue(null);
    this.eligibleChiefList = [];
    this.selectedInspectorList = [];
    this.chiefList = [];
    this.inspectorList = [];
    this.inspectionplanInspectorService.setInspectorListIsValid(false);
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
    const startDate = tuiDayToDate(this.inspectionPlanForm.get('startDate')?.value);
    startDate.setUTCHours(0);
    const endDate = tuiDayToDate(this.inspectionPlanForm.get('endDate')?.value);
    endDate.setUTCHours(0);
    const formData = new FormData();
    const inspectionPlan = {
      inspectionPlanName: this.inspectionPlanForm.get('inspectionPlanName')?.value,
      description: this.inspectionPlanForm.get('description')?.value,
      chiefId: this.inspectionPlanForm.get('chiefId')?.value,
      inspectorIds: this.inspectionPlanForm.get('inspectorIds')?.value,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      schoolId: this.inspectionPlanForm.get('schoolId')?.value,
      documentInspectionPlanDto: {
        documentName: this.inspectionPlanForm.get('documentInspectionPlanDto.documentName')?.value,
        documentCode: this.inspectionPlanForm.get('documentInspectionPlanDto.documentCode')?.value
      }
    }


    formData.append("request", new Blob([JSON.stringify(inspectionPlan)], {type: "application/json"}))
    const file = this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.value
    formData.append(`file`, file, file.name);

    this.confirmationService.confirm({
      message: 'Xác nhận tạo quyết định kiểm tra?',
      header: 'Xác nhận tạo',
      key: 'changeTime',
      icon: 'bi bi-info-circle',
      accept: () => {
        this.createLoadingVisibility = true;

        const saveInspectionPlan = this.inspectionPlanService.saveInspectionPlan(formData).subscribe({
          next: (response) => {
            this.createComplete = true;
            setTimeout(() => {
              this.router.navigateByUrl("inspection-plan/" + response.inspectionPlan.inspectionPlanId);
            }, 1000);
          },
          error: (error) => {
            this.createFailed = true;
            this.toastService.showError('deleteInComplete', "Tạo kế hoạch không thành công", error.error.message);
            if (error.error.message == "Mã văn bản trùng lặp") {
              this.duplicateDocumentCode = true;
            }
            setTimeout(() => {
              this.createLoadingVisibility = false;
              this.createFailed = false;
            }, 1000)
          }
        })
        this.subscriptions.push(saveInspectionPlan);
      },
      reject: (type: ConfirmEventType) => {
        return;
      }
    });
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
