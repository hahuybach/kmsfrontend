import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountResponse} from "../../../../../models/account-response";
import {inspectionPlanService} from "../../../../../services/inspectionplan.service";
import {RecordService} from "../../../../../services/record.service";
import {Subscription} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";

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
  startDate: string;
  endDate: string;
  defaultDeadline: string;
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
  ) {
  }

  resetCreateRecordPopupVisible() {
    this.createRecordPopupVisibleChange.emit(this.createRecordPopupVisible);
  }

  ngOnInit(): void {
    this.inspectionPlanService.getInspectionPlanById(this.inspectionPlanId).subscribe({
      next: (data) => {
        this.inspectionPlan = data;
        this.startDate = data.inspectionPlan.startDate.slice(0, 10);
        this.endDate = data.inspectionPlan.endDate.slice(0, 10);
        this.defaultDeadline = data.inspectionPlan.startDate;
        this.recordForm.get('deadline')?.setValue(this.defaultDeadline.split('T')[0]);
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
    this.formSubmitted = true;
    const saveTask =
    this.recordService.saveTask(record).subscribe({
      next: (response) => {
        this.formCompleted = true;
        setTimeout(() =>{
          this.createRecordPopupVisible = false;
          this.resetCreateRecordPopupVisible();
        },1500)
      },
      error: (error) => {
        console.log(error)
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
