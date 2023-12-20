import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountResponse} from "../../../../../models/account-response";
import {RecordService} from "../../../../../services/record.service";
import {inspectionPlanService} from "../../../../../services/inspectionplan.service";
import {TaskDetailDto} from "../../../../../models/task";
import {Subscription} from "rxjs";
import {ToastService} from "../../../../../shared/toast/toast.service";
import {TuiDay} from "@taiga-ui/cdk";
import {dateToTuiDay, tuiDayToDate} from "../../../../../shared/util/util";
import {NoWhitespaceValidator} from "../../../../../shared/validators/no-white-space.validator";
import {ConfirmationService, ConfirmEventType} from "primeng/api";

@Component({
  selector: 'app-update-record',
  templateUrl: './update-record.component.html',
  styleUrls: ['./update-record.component.scss']
})
export class UpdateRecordComponent implements OnInit, OnChanges {
  @Input() inspectionPlanId: number;
  @Input() recordId: number;
  @Input() updateRecordPopupVisible: boolean;
  @Output() updateRecordPopupVisibleChange = new EventEmitter<boolean>();
  recordForm: FormGroup;
  startDate: TuiDay;
  endDate: TuiDay;
  formSubmitted: boolean = false;
  formCompleted: boolean = false;
  formFailed: boolean = false;
  task: TaskDetailDto;
  taskId: number;
  inspectionPlan: {
    inspectors: AccountResponse[];
    endDate: Date;
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

  resetUpdateRecordPopupVisible() {
    this.resetForm();
    this.updateRecordPopupVisibleChange.emit(this.updateRecordPopupVisible);
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
        }else{
          this.startDate = dateToTuiDay(new Date(data.inspectionPlan.startDate));
        }
        this.endDate = dateToTuiDay(new Date(data.inspectionPlan.endDate));
      },
      error: (error) => {
        this.toastService.showError('updateRecordFail', "Không tìm thấy dữ liệu", error.error.message);
      }
    })
    this.subscriptions.push(initInspectionPlan);
  }

  resetForm() {
    this.recordForm.reset();
    this.formSubmitted = false;
    this.formCompleted = false;
  }


  ngOnInit(): void {
    this.initInspectionPlan();

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
      message: "Bạn có muốn cập nhật mục kiểm tra này?",
      header: "Xác nhận cập nhật mục kiểm tra",
      key: "updateTask",
      icon: 'bi bi-exclamation-triangle',
      accept: () => {
        const deadline = tuiDayToDate(this.recordForm.get('deadline')?.value);
        deadline.setUTCHours(0);

        const record = {
          taskId: this.taskId,
          taskName: this.recordForm.get('recordName')?.value,
          description: this.recordForm.get('recordDescription')?.value,
          deadline: deadline.toISOString(),
          assigneeId: this.recordForm.get('assigneeId')?.value,
        }

        this.formSubmitted = true;
        const updateRecord = this.recordService.updateTask(record).subscribe({
          next: (response) => {
            this.formCompleted = true;
            setTimeout(() =>{
              this.updateRecordPopupVisible = false;
              this.formCompleted = false;
              this.formSubmitted = false;
            },1000)
          },
          error: (error) => {
            this.formFailed = true;
            this.toastService.showError('updateRecordFail', "Cập nhật mục kiểm tra không thành công", error.error.message);
            setTimeout(() =>{
              this.updateRecordPopupVisible = false;
              this.formFailed = false;
              this.resetForm();
              this.initInspectionPlan();
            },1000)
          }
        })
        this.subscriptions.push(updateRecord);
      },
      reject: (type: ConfirmEventType) => {
        return;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recordId'] && changes['recordId'].isFirstChange()) {
      return;
    }
    const getRecordData = this.recordService.getRecordById(this.recordId).subscribe({
      next: (data) => {
        this.task = data.taskDetailDto;
        this.taskId = data.taskDetailDto.taskId;
        this.recordForm.patchValue({
          recordName: this.task.taskName,
          recordDescription: this.task.description,
          deadline: dateToTuiDay(new Date(this.task.deadline)),
          assigneeId: this.task.assignee?.accountId
        })
      },
      error: (error) => {
        this.formFailed = true;
        this.toastService.showError('updateRecordFail', "Không tìm thấy dữ liệu mục kiểm tra", error.error.message);
      }
    })
    this.subscriptions.push(getRecordData);
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
