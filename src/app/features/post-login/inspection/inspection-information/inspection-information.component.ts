import {Component, OnInit} from '@angular/core';
import {Inspection} from "../../../../models/inspection";
import {InspectionService} from "../../../../services/inspection.service";
import {ActivatedRoute} from "@angular/router";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";

@Component({
  selector: 'app-inspection-information',
  templateUrl: './inspection-information.component.html',
  styleUrls: ['./inspection-information.component.scss'],
})
export class InspectionInformationComponent implements OnInit {
  inspectionId: number | null;
  inspection: Inspection;
  tabs: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;
  issueDocumentVisibility: boolean = true;
  initiationDocumentVisibility: boolean = false;
  inspectionPlanDocumentVisibility: boolean = false;

  constructor(
    private readonly inspectionService: InspectionService,
    private readonly route: ActivatedRoute,
  ) {
  }

  issueDocumentVisible(){
    this.issueDocumentVisibility = true;
    this.initiationDocumentVisibility = false;
    this.inspectionPlanDocumentVisibility = false;
  }
  initiationDocumentVisible(){
    this.issueDocumentVisibility = false;
    this.initiationDocumentVisibility = true;
    this.inspectionPlanDocumentVisibility = false;
  }
  inspectionPlanDocumentVisible(){
    this.issueDocumentVisibility = false;
    this.initiationDocumentVisibility = false;
    this.inspectionPlanDocumentVisibility = true;
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
    this.inspectionService.getInspectionInformation(this.inspectionId).subscribe({
      next: (data) => {
        this.inspection = data;
        console.log(this.inspection)
      },
      error: (error) => {
        console.log(error)
      }
    })

    this.tabs = [
      { label: 'Kế hoạch kiểm tra', command: (click) => {this.issueDocumentVisible()}},
      { label: 'Kế hoạch thực hiện năm học', command: (click) => {this.initiationDocumentVisible()}},
      { label: 'Quyết định kiểm tra',command: (click) => {this.inspectionPlanDocumentVisible()}},
    ];
    this.activeTab = this.tabs[0];

  }
}
