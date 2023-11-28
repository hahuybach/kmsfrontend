import {Component, OnInit} from '@angular/core';
import {InspectionService} from "../../../../services/inspection.service";
import {ActivatedRoute} from "@angular/router";
import {Inspection, TaskListDto} from "../../../../models/inspection";
import {RecordService} from "../../../../services/record.service";

@Component({
  selector: 'app-inspection-mytask',
  templateUrl: './inspection-mytask.component.html',
  styleUrls: ['./inspection-mytask.component.scss']
})
export class InspectionMytaskComponent implements OnInit{
  inspectionId: number | null;
  taskList: TaskListDto[];
  recordId: number;
  detailRecordPopupVisible: boolean = false;

  constructor(
    private readonly taskService: RecordService,
    private readonly route: ActivatedRoute,
  ) {
  }

  changeDetailRecordVisible() {
    this.detailRecordPopupVisible = !this.detailRecordPopupVisible;
  }

  initDetailRecordData(recordId: number) {
    this.recordId = recordId;
    this.changeDetailRecordVisible()
  }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(parentParams => {
      this.inspectionId = parentParams['id'];
    })
    this.taskService.getInspectionMyTask(this.inspectionId).subscribe({
      next: (data) => {
        this.taskList = data.taskListDtos;
        console.log(this.taskList);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

}
