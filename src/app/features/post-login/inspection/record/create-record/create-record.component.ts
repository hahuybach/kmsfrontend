import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountResponse} from "../../../../../models/account-response";
import {inspectionPlanService} from "../../../../../services/inspectionplan.service";
import {RecordService} from "../../../../../services/record.service";

@Component({
  selector: 'app-create-record',
  templateUrl: './create-record.component.html',
  styleUrls: ['./create-record.component.scss']
})
export class CreateRecordComponent implements OnInit {
  @Input() inspectionPlanId: number;
  @Input() createRecordPopupVisible: boolean;
  @Output() createRecordPopupVisibleChange = new EventEmitter<boolean>();
  recordForm: FormGroup;
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

  resetCreateRecordPopupVisible() {
    this.createRecordPopupVisibleChange.emit(this.createRecordPopupVisible);
  }

  ngOnInit(): void {
    this.inspectionPlanService.getInspectionPlanById(this.inspectionPlanId).subscribe({
      next: (data) => {
        this.inspectionPlan = data;
        console.log(this.inspectionPlan)
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
      inspectionPlanId: this.inspectionPlanId,
      taskName: this.recordForm.get('recordName')?.value,
      description: this.recordForm.get('recordDescription')?.value,
      deadline: new Date(this.recordForm.get('deadline')?.value).toISOString(),
      assigneeId: this.recordForm.get('assigneeId')?.value,
    }

    this.recordService.saveTask(record).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

}
