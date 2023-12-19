import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../../../../services/inspection.service';
import { ActivatedRoute } from '@angular/router';
import { Inspection, TaskListDto } from '../../../../models/inspection';
import { RecordService } from '../../../../services/record.service';
import {ToastService} from "../../../../shared/toast/toast.service";

@Component({
  selector: 'app-inspection-mytask',
  templateUrl: './inspection-mytask.component.html',
  styleUrls: ['./inspection-mytask.component.scss'],
})
export class InspectionMytaskComponent implements OnInit {
  inspectionId: number | null;
  taskList: TaskListDto[];
  recordId: number;
  detailRecordPopupVisible: boolean = false;
  filterVisible: Boolean = false;
  canAlterDoc: boolean;
  constructor(
    private readonly taskService: RecordService,
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService,
  ) {}

  changeDetailRecordVisible() {
    this.initTaskData();
    this.detailRecordPopupVisible = !this.detailRecordPopupVisible;
  }

  initDetailRecordData(recordId: number) {
    this.recordId = recordId;
    this.changeDetailRecordVisible();
  }

  getStatusSeverity(statusId: any): string {
    const statusSeverityMap: { [key: number]: string } = {
      22: 'warning',
      23: 'success',
    };
    return statusSeverityMap[statusId] || 'info';
  }

  ngOnInit(): void {
    this.route.parent?.params.subscribe((parentParams) => {
      this.inspectionId = parentParams['id'];
    });
    this.initTaskData();
  }

  initTaskData(){
    this.taskService.getInspectionMyTask(this.inspectionId).subscribe({
      next: (data) => {
        console.log(data)
        this.taskList = data.taskListDtos;
        this.canAlterDoc = data.canAlterDoc;
      },
      error: (error) => {
        this.toastService.showError('my-task', "Không tìm thấy công việc của bạn", error.error.message);
      },
    });
  }
  changeFilterVisible(status: Boolean) {
    this.filterVisible = status;
  }
}
