import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountResponse} from "../../../../../models/account-response";
import {inspectionPlanService} from "../../../../../services/inspectionplan.service";
import {RecordService} from "../../../../../services/record.service";
import {Subscription} from "rxjs";
import {ToastService} from "../../../../../shared/toast/toast.service";
import {TuiDay} from "@taiga-ui/cdk";
import {dateToTuiDay, tuiDayToDate} from "../../../../../shared/util/util";
import {NoWhitespaceValidator} from "../../../../../shared/validators/no-white-space.validator";
import {ConfirmationService, ConfirmEventType} from "primeng/api";

@Component({
  selector: 'app-create-record',
  templateUrl: './create-record.component.html',
  styleUrls: ['./create-record.component.scss']
})
export class CreateRecordComponent implements OnInit, OnDestroy {
  @Input() inspectionPlanId: number;
  @Input() createRecordPopupVisible: boolean;
  @Output() createRecordPopupVisibleChange = new EventEmitter<boolean>();
  formSubmitted:boolean = false;
  formCompleted:boolean = false;
  formFailed:boolean = false;
  recordForm: FormGroup;
  startDate: TuiDay;
  endDate: TuiDay;
  defaultDeadline: TuiDay;
  inspectionPlan: {
    inspectors: AccountResponse[];
    endDate: Date;
    startDate: Date;
  }
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly inspectionPlanService: inspectionPlanService,
    private readonly recordService: RecordService,
    private readonly toastService: ToastService,
    private readonly confirmationService: ConfirmationService,
  ) {
  }

  resetCreateRecordPopupVisible() {
    this.resetForm();
    this.createRecordPopupVisibleChange.emit(this.createRecordPopupVisible);
    this.initInspectionPlan();
  }

  resetForm() {
    this.recordForm.reset();
    this.formSubmitted = false;
    this.formCompleted = false;
  }

  isBeforeToday(date: Date): boolean{
    let today: Date = new Date();
    return date < today;
  }

  initInspectionPlan(){
    const initInspectionPlan = this.inspectionPlanService.getInspectionPlanById(this.inspectionPlanId).subscribe({
      next: (data) => {
        this.inspectionPlan = data;
        if (this.isBeforeToday(new Date(data.inspectionPlan.startDate))){
          this.startDate = dateToTuiDay(new Date());
          this.defaultDeadline = dateToTuiDay(new Date());
        }else{
          this.startDate = dateToTuiDay(new Date(data.inspectionPlan.startDate));
          this.defaultDeadline = dateToTuiDay(new Date(data.inspectionPlan.startDate));
        }
        this.endDate = dateToTuiDay(new Date(data.inspectionPlan.endDate));
        this.recordForm.get('deadline')?.setValue(this.defaultDeadline);
      },
      error: (error) => {
        this.toastService.showError('createRecordError', "Không tìm thấy kế hoạch", error.error.message);
      }
    })
    this.subscriptions.push(initInspectionPlan);
  }

  ngOnInit(): void {
    this.initInspectionPlan()
    this.recordForm = this.fb.group({
      recordName: [null, Validators.compose([NoWhitespaceValidator() ,Validators.required, Validators.maxLength(256)])],
      recordDescription: [null, Validators.compose([NoWhitespaceValidator() ,Validators.required])],
      deadline: [null, Validators.compose([Validators.required])],
      assigneeId: [null, Validators.compose([Validators.required])]
    })

  }

  onSubmit() {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    this.confirmationService.confirm({
      message: "Bạn có tạo mục kiểm tra này?",
      header: "Xác nhận tạo mục kiểm tra",
      key: "createTask",
      icon: 'bi bi-info-circle',
      accept: () => {
        const deadline = tuiDayToDate(this.recordForm.get('deadline')?.value);
        deadline.setUTCHours(0);
        const record = {
          inspectionPlanId: this.inspectionPlanId,
          taskName: this.recordForm.get('recordName')?.value,
          description: this.recordForm.get('recordDescription')?.value,
          deadline: deadline.toISOString(),
          assigneeId: this.recordForm.get('assigneeId')?.value,
        }
        this.formSubmitted = true;
        const saveTask = this.recordService.saveTask(record).subscribe({
          next: (response) => {
            this.formCompleted = true;
            setTimeout(() =>{
              this.resetForm();
              this.createRecordPopupVisible = false;
              this.initInspectionPlan();
            },1000)
          },
          error: (error) => {
            this.formFailed = true;
            this.toastService.showError('createRecordError', "Tạo mục kiểm tra không thành công", error.error.message);
            setTimeout(() => {
              this.formSubmitted = false;
              this.formFailed = false;
              this.resetForm();
            }, 1000);
          }
        });
        this.subscriptions.push(saveTask);
      },
      reject: (type: ConfirmEventType) => {
        return;
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
