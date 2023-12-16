import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {skip, Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FileService} from "../../../../services/file.service";
import {trigger, transition, state, animate, style, group} from "@angular/animations";
import {InspectionplanInspectorlistService} from "../../../../services/inspectionplan-inspectorlist.service";
import {ConfirmEventType, ConfirmationService} from "primeng/api";
import {TuiDay} from "@taiga-ui/cdk";
import {dateToTuiDay, tuiDayToDate} from "../../../../shared/util/util";
import {ToastService} from "../../../../shared/toast/toast.service";
import {NoWhitespaceValidator} from "../../../../shared/validators/no-white-space.validator";

@Component({
  selector: 'app-update-inspection-plan',
  templateUrl: './update-inspection-plan.component.html',
  styleUrls: ['./update-inspection-plan.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        'max-height': '500px', 'opacity': '1', 'visibility': 'visible'
      })),
      state('out', style({
        'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
      })),
      transition('in => out', [group([
          animate('400ms ease-in-out', style({
            'opacity': '0'
          })),
          animate('500ms ease-in-out', style({
            'max-height': '0px'
          })),
          animate('500ms ease-in-out', style({
            'visibility': 'hidden'
          }))
        ]
      )]),
      transition('out => in', [group([
          animate('1ms ease-in-out', style({
            'visibility': 'visible',
          })),
          animate('500ms ease-in-out', style({
            'max-height': '500px'
          })),
          animate('500ms ease-in-out', style({
            'opacity': '1'
          }))
        ]
      )])
    ])
  ]
})

export class UpdateInspectionPlanComponent {
  inspectionPlanForm: FormGroup;
  popupInspectorVisible: boolean = false;
  inspectionPlanId: number;
  inspectionPlanDetail: any;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  pdfPreviewVisibility: boolean = false;
  documentUpdated: boolean = false;
  fileInputPlaceholders: string;
  inspectorList: any[];
  nonInspectorList: any[];
  chiefInspector: any;
  minStartDate: TuiDay;
  maxStartDate: TuiDay;
  minEndDate: TuiDay;
  eligibleChiefList: any[];
  chiefList: any[];
  selectedInspectorList: any[] = [];
  inspectorListIsValid: boolean = true;
  private subscriptions: Subscription[] = [];

  updateLoadingVisibility: boolean = false;
  updateComplete: boolean = false;
  updateFailed: boolean = false;
  duplicateDocumentCode: boolean = false;

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
      caption: 'Cập nhật kế hoạch thanh tra'
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly cdref: ChangeDetectorRef,
    private readonly inspectionPlanService: inspectionPlanService,
    private readonly fileService: FileService,
    private readonly sanitizer: DomSanitizer,
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: ToastService
  ) {
  }

  changeInspectorVisible() {
    this.popupInspectorVisible = !this.popupInspectorVisible;
  }

  changeDocumentUpdate() {
    this.documentUpdated = !this.documentUpdated;
  }

  onResetList() {
    this.inspectionplanInspectorService.resetBothLists()
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

  ngOnInit() {
    this.inspectionPlanForm = this.fb.group({
      inspectionPlanName: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
      description: [null, Validators.compose([NoWhitespaceValidator(), Validators.required])],
      chiefId: [null, Validators.compose([Validators.required])],
      inspectorIds: [[], Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      documentInspectionPlanDto: this.fb.group({
        documentName: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
        documentCode: [null, Validators.compose([NoWhitespaceValidator(), Validators.required, Validators.maxLength(256)])],
        documentFile: [null, Validators.compose([Validators.required])]
      })
    })

    let tomorow: Date = new Date();
    tomorow.setDate(tomorow.getDate() + 1);

    const initInspectionPlan = this.route.params
      .pipe(
        switchMap((params) => {
          this.inspectionPlanId = +params['id'];
          return this.inspectionPlanService.getInspectionPlanById(this.inspectionPlanId);
        })
      ).subscribe({
        next: (data) => {
          this.inspectionPlanDetail = data;
          this.nonInspectorList = data.nonInspectors;
          this.chiefList = data.eligibleChief;
          this.inspectorList = data.inspectors;
          this.getInspectorIds(this.inspectorList);
          this.inspectionplanInspectorService.setInspectorList(this.inspectorList);
          this.inspectionplanInspectorService.setPopupInspectorList(this.nonInspectorList);
          this.inspectionplanInspectorService.setInspectorListIsValid(this.inspectorListIsValid);
          this.subscriptions.push(
            this.inspectionplanInspectorService.inspectorList$.subscribe(list => this.inspectorList = list),
            this.inspectionplanInspectorService.popupInspectorList$.subscribe(list => this.nonInspectorList = list),
            this.inspectionplanInspectorService.inspectorListIsValid$.subscribe(isValid => this.inspectorListIsValid = isValid)
          );
          this.getInspectorIds(this.inspectionPlanDetail.inspectors);
          this.chiefInspector = this.inspectorList.filter(inspector => inspector.chief)[0];
          this.inspectionPlanForm.patchValue({
            inspectionPlanName: this.inspectionPlanDetail.inspectionPlan.inspectionPlanName,
            description: this.inspectionPlanDetail.inspectionPlan.description,
            startDate: dateToTuiDay(new Date(this.inspectionPlanDetail.inspectionPlan.startDate)),
            endDate: dateToTuiDay(new Date(this.inspectionPlanDetail.inspectionPlan.endDate)),
            chiefId: this.chiefInspector.accountId
          })
        },
        error: (error) => {
          this.toastService.showError('updateInspectionPlan', "Lỗi quyết định kiểm tra", "Không tìm thấy quyết định kiểm tra");
        }
      });

    this.subscriptions.push(initInspectionPlan);
    this.minEndDate = dateToTuiDay(tomorow);
    this.minStartDate = dateToTuiDay(tomorow);

    this.inspectionPlanForm.get('startDate')?.valueChanges.pipe(skip(1)).subscribe(x => {
      this.onStartDateChange()
    });

    this.inspectionPlanForm.get('endDate')?.valueChanges.pipe(skip(1)).subscribe(x => {
      this.onEndDateChange();
    });
  }

  openNewTab(documentLink: string) {
    this.pdfPreviewVisibility = true;
    const fileService = this.fileService.readInspectionPlanPDF(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    });
    this.subscriptions.push(fileService);
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

  get documentNameControls() {
    return (this.inspectionPlanForm.get('documentInspectionPlanDto') as FormGroup).controls['documentName'];
  }

  get documentCodeControls() {
    return (this.inspectionPlanForm.get('documentInspectionPlanDto') as FormGroup).controls['documentCode'];
  }

  get documentFileControls() {
    return (this.inspectionPlanForm.get('documentInspectionPlanDto') as FormGroup).controls['documentFile'];
  }

  initInspectorList() {
    let startDate = new Date(tuiDayToDate(this.inspectionPlanForm.get('startDate')?.value)).toISOString();
    let endDate = new Date(tuiDayToDate(this.inspectionPlanForm.get('endDate')?.value)).toISOString();
    const initInspector = this.inspectionPlanService.getEligibleInspector(startDate, endDate, this.inspectionPlanId).subscribe({
      next: (data: any) => {
        this.nonInspectorList = data.inspectorDtos;
        this.chiefList = data.chiefDtos;
        this.inspectionplanInspectorService.setPopupInspectorList(this.nonInspectorList);
        this.inspectionplanInspectorService.popupInspectorList$.subscribe(list => this.nonInspectorList = list);
      },
      error: (error) => {
        this.toastService.showError('updateInspectionPlan', "Lỗi danh sách thanh tra", error.error.message);
      }
    });
    this.subscriptions.push(initInspector)
  }

  onEndDateChange() {
    if (this.inspectorList.length > 0) {
      this.confirmationService.confirm({
        message: 'Thay đổi thời gian sẽ xóa danh sách đoàn kiểm tra. Bạn có muốn tiếp tục?',
        header: 'Xác nhận thay đổi',
        key: 'changeTime',
        icon: 'bi bi-exclamation-triangle',
        accept: () => {
          this.resetInspectorList();
          this.maxStartDate = this.inspectionPlanForm.get('endDate')?.value;
          this.initInspectorList()
        },
        reject: (type: ConfirmEventType) => {
        }
      });
    }else {
      this.maxStartDate = this.inspectionPlanForm.get('endDate')?.value;
      this.initInspectorList()
    }
  }

  onStartDateChange() {
    if (this.inspectorList.length > 0) {
      this.confirmationService.confirm({
        message: 'Thay đổi thời gian sẽ xóa danh sách đoàn kiểm tra. Bạn có muốn tiếp tục?',
        header: 'Xác nhận thay đổi',
        key: 'changeTime',
        icon: 'bi bi-exclamation-triangle',
        accept: () => {
          this.resetInspectorList();
          this.minEndDate = this.inspectionPlanForm.get('startDate')?.value;
          this.initInspectorList();
        },
        reject: (type: ConfirmEventType) => {
        }
      });
    }else{
      this.minEndDate = this.inspectionPlanForm.get('startDate')?.value;
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
    this.inspectionplanInspectorService.clearBothList();
    this.inspectionplanInspectorService.setInspectorListIsValid(false);
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.inspectionPlanForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  onSubmit() {
    if (!this.documentUpdated) {
      this.inspectionPlanForm.get('documentInspectionPlanDto.documentName')?.setErrors(null);
      this.inspectionPlanForm.get('documentInspectionPlanDto.documentCode')?.setErrors(null);
      this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.setErrors(null);
    }

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
      inspectionPlanId: this.inspectionPlanDetail.inspectionPlan.inspectionPlanId,
      inspectionPlanName: this.inspectionPlanForm.get('inspectionPlanName')?.value,
      description: this.inspectionPlanForm.get('description')?.value,
      chiefId: this.inspectionPlanForm.get('chiefId')?.value,
      inspectorIds: this.inspectionPlanForm.get('inspectorIds')?.value,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      documentInspectionPlanDto: {
        documentName: null,
        documentCode: null
      }
    }
    if (this.documentUpdated) {
      inspectionPlan.documentInspectionPlanDto.documentName = this.inspectionPlanForm.get('documentInspectionPlanDto.documentName')?.value;
      inspectionPlan.documentInspectionPlanDto.documentCode = this.inspectionPlanForm.get('documentInspectionPlanDto.documentCode')?.value;
      const file = this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.value
      formData.append(`file`, file, file?.name);
    } else {
      formData.append(`file`, '');
    }
    formData.append("request", new Blob([JSON.stringify(inspectionPlan)], {type: "application/json"}))

    this.updateLoadingVisibility = true
    const update = this.inspectionPlanService.updateInspectionPlan(formData).subscribe({
      next: (response) => {
        this.updateComplete = true;
        setTimeout(() => {
          this.router.navigateByUrl("inspection-plan/" + response.inspectionPlan.inspectionPlanId);
        }, 1000);
      },
      error: (error) => {
        this.updateFailed = true;
        this.toastService.showError('updateInspectionPlan', "Cập nhật kế hoạch không thành công", error.error.message);
        if (error.error.message == "Mã văn bản trùng lặp") {
          this.duplicateDocumentCode = true;
        }
        setTimeout(() => {
          this.updateLoadingVisibility = false;
          this.updateFailed = false;
        }, 1000)
      }
    })
    this.subscriptions.push(update);
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
