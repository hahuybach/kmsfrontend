import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountResponse} from "../../../../../models/account-response";
import {RecordService} from "../../../../../services/record.service";
import {inspectionPlanService} from "../../../../../services/inspectionplan.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {TaskListDto} from "../../../../../models/inspection";
import {TaskDetailDto} from "../../../../../models/task";
import {Subscription} from "rxjs";
import {ToastService} from "../../../../../shared/toast/toast.service";
import {TuiDay} from "@taiga-ui/cdk";
import {dateToTuiDay, tuiDayToDate} from "../../../../../shared/util/util";
import {NoWhitespaceValidator} from "../../../../../shared/validators/no-white-space.validator";

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
    private readonly toastService: ToastService
  ) {
  }

  resetUpdateRecordPopupVisible() {
    this.resetForm();
    this.updateRecordPopupVisibleChange.emit(this.updateRecordPopupVisible);
  }

  initInspectionPlan(){
    const initInspectionPlan = this.inspectionPlanService.getInspectionPlanById(this.inspectionPlanId).subscribe({
      next: (data) => {
        this.inspectionPlan = data;
        this.startDate = dateToTuiDay(new Date(data.inspectionPlan.startDate));
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
        this.toastService.showError('updateRecordFail', "Cập nhật mục kiểm tra không thành công", error.error.message);
        setTimeout(() =>{
          this.updateRecordPopupVisible = false;
          this.initInspectionPlan();
        },1000)
      }
    })
    this.subscriptions.push(updateRecord);
  }

  ngOnChanges(changes: SimpleChanges): void {
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
