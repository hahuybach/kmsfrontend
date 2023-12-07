import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FileService} from "../../../../services/file.service";
import {trigger, transition, state, animate, style, group} from "@angular/animations";
import {InspectionplanInspectorlistService} from "../../../../services/inspectionplan-inspectorlist.service";
import {ConfirmEventType, ConfirmationService} from "primeng/api";
import {TuiDay} from "@taiga-ui/cdk";
import {dateToTuiDay} from "../../../../shared/util/util";

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
  defaultEndDate: Date = new Date();
  defaultStartDate: Date = new Date();
  inspectorListIsValid: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly cdref: ChangeDetectorRef,
    private readonly inspectionPlanService: inspectionPlanService,
    private readonly fileService: FileService,
    private readonly sanitizer: DomSanitizer,
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService
  ) {
  }

  changeInspectorVisible() {
    this.popupInspectorVisible = !this.popupInspectorVisible;
  }

  changeDocumentUpdate() {
    this.documentUpdated = !this.documentUpdated;
  }

  onResetList() {
    this.inspectionplanInspectorService.setInspectorListIsValid(false);
    this.inspectionplanInspectorService.resetBothLists()
  }

  getInspectorIds(data: any) {
    let inspectorListId = data.map((item: { accountId: any; }) => item.accountId);
    this.eligibleChiefList = data.filter((eligibleInspector: {
      accountId: number;
    }) => this.chiefList.some(inspector => inspector.accountId === eligibleInspector.accountId));
    this.inspectionPlanForm.get('inspectorIds')?.setValue(inspectorListId);
  }

  ngOnInit() {
    this.inspectionPlanForm = this.fb.group({
      inspectionPlanName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
      description: [null, Validators.compose([Validators.required])],
      chiefId: [null, Validators.compose([Validators.required])],
      inspectorIds: [[], Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      documentInspectionPlanDto: this.fb.group({
        documentName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
        documentCode: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
        documentFile: [null, Validators.compose([Validators.required])]
      })
    })

    let tomorow: Date = new Date();
    tomorow.setDate(tomorow.getDate() + 1);

    this.route.params
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
        this.inspectionplanInspectorService.inspectorList$.subscribe(list => this.inspectorList = list);
        this.inspectionplanInspectorService.popupInspectorList$.subscribe(list => this.nonInspectorList = list);
        this.inspectionplanInspectorService.inspectorListIsValid$.subscribe(isValid => this.inspectorListIsValid = isValid);
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
        console.log(error);
      }
    });

    this.minEndDate = dateToTuiDay(tomorow);
    this.minStartDate = dateToTuiDay(tomorow);
    this.inspectionPlanForm.get('endDate')?.valueChanges.subscribe( x => {
      this.onEndDateChange();
    })
    this.inspectionPlanForm.get('startDate')?.valueChanges.subscribe( x => {
      this.onStartDateChange();
    })
  }

  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.pdfPreviewVisibility = true;
    this.fileService.readInspectionPlanPDF(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    });
  }

  patchChiefId() {
    this.inspectionPlanForm.patchValue({
      chiefId: this.chiefInspector.accountId
    })
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
    let startDate = new Date(this.inspectionPlanForm.get('startDate')?.value).toISOString();
    let endDate = new Date(this.inspectionPlanForm.get('endDate')?.value).toISOString();
    this.inspectionPlanService.getEligibleInspector(startDate, endDate).subscribe({
      next: (data: any) => {
        this.nonInspectorList = data.inspectorDtos;
        this.chiefList = data.chiefDtos;
        this.inspectionplanInspectorService.setPopupInspectorList(this.nonInspectorList);
        this.inspectionplanInspectorService.popupInspectorList$.subscribe(list => this.nonInspectorList = list);
      },
      error: (error) => {
        console.log(error)
      }
    });
  }


  onStartDateChange() {
    if (this.inspectorList.length > 0) {
      this.confirm1("Thay đổi thời gian kiểm tra sẽ xóa toàn bộ danh sách đoàn kiểm tra. Bạn có muốn tiếp tục", "Xác nhận");
    }
    this.initInspectorList();
  }

  onEndDateChange() {
    if (this.inspectorList.length > 0) {
      this.confirm1("Thay đổi thời gian kiểm tra sẽ xóa toàn bộ danh sách đoàn kiểm tra. Bạn có muốn tiếp tục", "Xác nhận");
    }
    this.initInspectorList()
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
    this.inspectionplanInspectorService.clearBothList();
    this.initInspectorList();
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

    const formData = new FormData();
    const inspectionPlan = {
      inspectionPlanId: this.inspectionPlanDetail.inspectionPlan.inspectionPlanId,
      inspectionPlanName: this.inspectionPlanForm.get('inspectionPlanName')?.value,
      description: this.inspectionPlanForm.get('description')?.value,
      chiefId: this.inspectionPlanForm.get('chiefId')?.value,
      inspectorIds: this.inspectionPlanForm.get('inspectorIds')?.value,
      startDate: new Date(this.inspectionPlanForm.get('startDate')?.value).toISOString(),
      endDate: new Date(this.inspectionPlanForm.get('endDate')?.value).toISOString(),
      documentInspectionPlanDto: {
        documentName: null,
        documentCode: null
      }
    }
    console.log(this.documentUpdated)
    if (this.documentUpdated) {
      inspectionPlan.documentInspectionPlanDto.documentName = this.inspectionPlanForm.get('documentInspectionPlanDto.documentName')?.value;
      inspectionPlan.documentInspectionPlanDto.documentCode = this.inspectionPlanForm.get('documentInspectionPlanDto.documentCode')?.value;
      const file = this.inspectionPlanForm.get('documentInspectionPlanDto.documentFile')?.value
      formData.append(`file`, file, file?.name);
    } else {
      formData.append(`file`, '');
    }
    formData.append("request", new Blob([JSON.stringify(inspectionPlan)], {type: "application/json"}))


    console.log(inspectionPlan)

    this.inspectionPlanService.updateInspectionPlan(formData).subscribe({
      next: (response) => {
        this.router.navigateByUrl("inspection-plan/" + response.inspectionPlan.inspectionPlanId);
      },
      error: (error) => {
        console.log(error)
      }
    })
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
