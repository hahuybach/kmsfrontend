import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaskDetailDto} from "../../../../../models/task";
import {AccountResponse} from "../../../../../models/account-response";
import {RecordService} from "../../../../../services/record.service";
import {inspectionPlanService} from "../../../../../services/inspectionplan.service";

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.scss']
})
export class RecordDetailComponent implements OnChanges{
  @Input() recordId: number;
  @Input() detailRecordPopupVisible: boolean;
  @Output() detailRecordPopupVisibleChange = new EventEmitter<boolean>();
  task: TaskDetailDto;

  constructor(
    private readonly recordService: RecordService,
  ) {
  }

  resetDetailRecordPopupVisible(){
    this.detailRecordPopupVisibleChange.emit(this.detailRecordPopupVisible);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.recordService.getRecordById(this.recordId).subscribe({
      next: (data) => {
        this.task = data.taskDetailDto;
        console.log(this.task)
      },
      error: (error) => {
        console.log(error);
      }
    })

  }

}
