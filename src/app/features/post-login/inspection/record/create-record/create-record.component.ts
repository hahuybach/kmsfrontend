import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountResponse} from "../../../../../models/account-response";
import {inspectionPlanService} from "../../../../../services/inspectionplan.service";
import {RecordService} from "../../../../../services/record.service";
import {Subscription} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ToastService} from "../../../../../shared/toast/toast.service";
import {TuiDay} from "@taiga-ui/cdk";
import {dateToTuiDay, tuiDayToDate} from "../../../../../shared/util/util";

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
    private readonly toastService: ToastService
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

  initInspectionPlan(){
    const initInspectionPlan = this.inspectionPlanService.getInspectionPlanById(this.inspectionPlanId).subscribe({
      next: (data) => {
        this.inspectionPlan = data;
        this.startDate = dateToTuiDay(new Date(data.inspectionPlan.startDate));
        this.endDate = dateToTuiDay(new Date(data.inspectionPlan.endDate));
        this.defaultDeadline = dateToTuiDay(new Date(data.inspectionPlan.startDate));
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
      recordName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
      recordDescription: [null, Validators.compose([Validators.required])],
      deadline: [null, Validators.compose([Validators.required])],
      assigneeId: [null, Validators.compose([Validators.required])]
    })

  }

  onSubmit() {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }
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
        this.toastService.showError('createRecordError', "Tạo mục kiểm tra không thành công", error.error.message);
      }
    });
    this.subscriptions.push(saveTask);
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
