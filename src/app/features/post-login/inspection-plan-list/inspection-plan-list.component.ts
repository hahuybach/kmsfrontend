import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {inspectionPlanService} from "../../../services/inspectionplan.service";
import {IssueDropDownResponse} from "../../../models/issue-drop-down-response";
import {SchoolResponse} from "../../../models/school-response";
import {SchoolService} from "../../../services/school.service";
import {IssueService} from "../../../services/issue.service";
import {ToastService} from "../../../shared/toast/toast.service";

@Component({
  selector: 'app-inspection-plan-list',
  templateUrl: './inspection-plan-list.component.html',
  styleUrls: ['./inspection-plan-list.component.scss'],
})
export class InspectionPlanListComponent implements OnInit{
  advanceSearch = false;
  planName: any;
  issueDropDowns: IssueDropDownResponse[];
  currentIssueSelected: any;
  schools: SchoolResponse[];
  selectedSchool: any
  creationStartDateTime: any;
  creationEndDateTime: any;
  creationDateError: boolean = false;
  deadlineStartDateTime: any;
  deadlineEndDateTime: any;
  deadlineDateError: any;
  advanceSearchButtonText = "Hiện tra cứu nâng cao";

  constructor(
    private readonly router: Router,
    private readonly inspectionPlanService: inspectionPlanService,
    private schoolService: SchoolService,
    private issueService: IssueService,
    private toastService: ToastService
  ) {}
  statuses = [
    {label: 'Chưa bắt đầu', value: 19},
    {label: 'Đang tiến hành', value: 20},
    {label: 'Đã quá hạn', value: 21},
    {label: 'Chưa hoàn thành', value: 22},
    {label: 'Hoàn thành', value: 23}
    ,
  ];
  selectedStatus: any;
  pageNo: number = 1;
  pageSize: number = 5;
  sortBy: string = 'createdDate';
  sortDirection: string = 'desc';
  totalElements: number;
  maxPage: any;
  recordPerPageOption: number[] = [5, 15, 25];
  ngOnInit(): void {
    this.schoolService.findAllSchools().subscribe({
      next: (data) => {
        this.schools = data
      },
      error: (error) => {
        this.toastService.showError("error", "Lỗi", error.error.message)
      }
    })

    this.issueService.getIssueDropDownResponse()
      .subscribe({
        next: (result) => {
          this.issueDropDowns = result.issueDropDownBoxDtos;
          this.currentIssueSelected = this.issueDropDowns.at(0);
          this.loadDocuments();

        },
        error: (error) => {
          this.toastService.showError("error", "Lỗi", error.error.message)
        }
      })
  }


  loadDocuments() {

  }

  onAdvanceSearch() {
    if (this.advanceSearch) {
      this.reset();
      this.advanceSearch = false;
      this.advanceSearchButtonText = 'Hiện tra cứu nâng cao'
    } else {
      this.reset();
      this.advanceSearch = true;
      this.advanceSearchButtonText = 'Ẩn tra cứu nâng cao'
    }
  }
  private reset() {
    this.pageNo = 1;
    this.sortBy = 'createdDate';
    this.sortDirection = 'desc';
    this.planName = '';
    this.selectedSchool = null;
    this.selectedStatus = null;
    this.currentIssueSelected = null;
    this.creationStartDateTime = null;
    this.creationEndDateTime = null;
    this.deadlineStartDateTime = null;
    this.deadlineEndDateTime = null;
    this.loadDocuments();
  }

  onSort(sortBy: string) {
    if (this.sortBy === sortBy) {
      // If it is the same column, toggle the sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If it is a different column, set the new sortBy and sortDirection
      this.sortBy = sortBy;
      this.sortDirection = 'asc'; // or 'desc' depending on your default sorting preference
    }

    // Reload the guidance documents with the updated sorting
    this.loadDocuments();
  }

}
