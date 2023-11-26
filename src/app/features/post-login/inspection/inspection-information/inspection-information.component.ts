import {Component, OnInit} from '@angular/core';
import {Inspection} from "../../../../models/inspection";
import {InspectionService} from "../../../../services/inspection.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-inspection-information',
  templateUrl: './inspection-information.component.html',
  styleUrls: ['./inspection-information.component.scss']
})
export class InspectionInformationComponent implements OnInit {
  inspectionId: number | null;
  inspection: Inspection;

  constructor(
    private readonly inspectionService: InspectionService,
    private readonly route: ActivatedRoute,
  ) {
  }

  getStatusSeverity(status: string): string {
    const statusSeverityMap: { [key: string]: string } = {
      "Chưa bắt đầu": 'info',
      "Đang tiến hành": 'warning',
      "Đã hoàn thành": 'success',
      "Đã quá hạn": 'danger',
    };
    return statusSeverityMap[status] || 'info'; // Default to ' info' if statusId is not in the map
  }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(parentParams => {
      this.inspectionId = parentParams['id'];
    })
    this.inspectionService.getInspectionInfomation(this.inspectionId).subscribe({
      next: (data) => {
        this.inspection = data;
        console.log(this.inspection)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
