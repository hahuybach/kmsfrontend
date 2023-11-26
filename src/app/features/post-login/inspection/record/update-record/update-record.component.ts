import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountResponse} from "../../../../../models/account-response";
import {RecordService} from "../../../../../services/record.service";
import {inspectionPlanService} from "../../../../../services/inspectionplan.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {TaskListDto} from "../../../../../models/inspection";
import {TaskDetailDto} from "../../../../../models/task";

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
  task: TaskDetailDto;
  taskId: number;
  inspectionPlan: {
    inspectors: AccountResponse[];
    endDate: Date;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly inspectionPlanService: inspectionPlanService,
    private readonly recordService: RecordService,
  ) {
  }

  resetUpdateRecordPopupVisible() {
    this.updateRecordPopupVisibleChange.emit(this.updateRecordPopupVisible);
  }

  ngOnInit(): void {
    this.inspectionPlanService.getInspectionPlanById(this.inspectionPlanId).subscribe({
      next: (data) => {
        this.inspectionPlan = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
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
    const formData = new FormData();
    const record = {
      taskId: this.taskId,
      taskName: this.recordForm.get('recordName')?.value,
      description: this.recordForm.get('recordDescription')?.value,
      deadline: new Date(this.recordForm.get('deadline')?.value).toISOString(),
      assigneeId: this.recordForm.get('assigneeId')?.value,
    }

    this.recordService.updateTask(record).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recordId'].currentValue === undefined){
      return;
    }
    this.recordService.getRecordById(this.recordId).subscribe({
      next: (data) => {
        this.task = data.taskDetailDto;
        this.taskId = data.taskDetailDto.taskId;
        this.recordForm.patchValue({
          recordName: this.task.taskName,
          recordDescription: this.task.description,
          deadline: new Date(this.task.deadline).toISOString().split('T')[0],
          assigneeId: this.task.assignee?.accountId
        })
      },
      error: (error) => {
        console.log(error);
      }
    })

  }

}
