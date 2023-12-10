import {Component, OnInit} from '@angular/core';
import {InitiationplanService} from 'src/app/services/initiationplan.service';
import {IssueDropDownResponse} from '../../../../models/issue-drop-down-response';
import {SchoolResponse} from '../../../../models/school-response';
import {SchoolService} from '../../../../services/school.service';
import {IssueService} from '../../../../services/issue.service';
import {ToastService} from '../../../../shared/toast/toast.service';
import {InitiationPlanResponse} from '../../../../models/initiation-plan-response';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {Role} from '../../../../shared/enum/role';
import {dateToTuiDay, toIsoStringUrl, tuiDayToDate} from "../../../../shared/util/util";
import {TuiDayRange} from "@taiga-ui/cdk";

@Component({
  selector: 'app-school-initiation-plan-list',
  templateUrl: './school-initiation-plan-list.component.html',
  styleUrls: ['./school-initiation-plan-list.component.scss'],
})
export class SchoolInitiationPlanListComponent implements OnInit {
  schoolInitPlans: InitiationPlanResponse[];
  advanceSearch: boolean = false;
  planName: string;
  issueDropDowns: IssueDropDownResponse[];
  currentIssueSelected: any;
  creationStartDateTime: any;
  creationEndDateTime: any;
  deadlineStartDateTime: any;
  deadlineEndDateTime: any;
  createDateRange :any;
  deadlineDateRange :any;


  advanceSearchButtonText = 'Hiện tra cứu nâng cao';
  schools: SchoolResponse[];
  selectedSchool: any;
  statuses = [
    {label: 'Đang thực thi', value: 6},
    {label: 'Chờ phê duyệt', value: 7},
    {label: 'Phê duyệt', value: 8},
    {label: 'Không được phê duyệt', value: 9},
  ];
  selectedStatus: any;

  pageNo: number = 1;
  pageSize: number = 5;
  sortBy: string = 'createdDate';
  sortDirection: string = 'desc';
  totalElements: number;
  maxPage: any;
  recordPerPageOption: number[] = [5, 15, 25];
  isPrincipal: boolean;

  constructor(
    private initiationplanService: InitiationplanService,
    private schoolService: SchoolService,
    private issueService: IssueService,
    private toastService: ToastService,
    private router: Router,
    private auth: AuthService,
    private activateRouter: ActivatedRoute
  ) {
  }

  initQuery() {
    this.activateRouter.queryParams.subscribe((value) => {
      if (value['pageNo']) {
        this.pageNo = value['pageNo'];
      }
      if (value['pageSize']) {
        this.pageSize = value['pageSize'];
      }
      if (value['sortBy']) {
        this.sortBy = value['sortBy'];
      }
      if (value['sortDirection']) {
        this.sortDirection = value['sortDirection'];
      }
      if (value['planName']) {
        this.planName = value['planName'];
      }
      if (
        value['currentIssueSelected'] &&
        value['currentIssueSelected'] !== undefined
      ) {
        this.currentIssueSelected = Number(value['currentIssueSelected']);
      }
      if (value['creationStartDateTime']) {
        this.creationStartDateTime = value['creationStartDateTime'];
        this.createDateRange = new TuiDayRange(
          dateToTuiDay(new Date(value['creationStartDateTime']))
          , dateToTuiDay(new Date())
        )
      }
      if (value['creationEndDateTime']) {
        this.creationEndDateTime = value['creationEndDateTime'];
        this.createDateRange.to = dateToTuiDay(new Date(value['creationEndDateTime']))
      }

      if (value['deadlineStartDateTime']) {
        this.deadlineStartDateTime = value['deadlineStartDateTime'];
        this.deadlineDateRange = new TuiDayRange(
          dateToTuiDay(new Date(value['deadlineStartDateTime']))
          , dateToTuiDay(new Date())
        )
      }
      if (value['deadlineEndDateTime']) {
        this.deadlineEndDateTime = value['deadlineEndDateTime'];
        this.deadlineDateRange.to = dateToTuiDay(new Date(value['deadlineEndDateTime']))

      }

      if (value['status'] && value['status'] !== undefined) {
        this.selectedStatus = Number(value['status']) ;
      }
      if (value['schoolId'] && value['schoolId'] !== undefined) {
        this.selectedSchool = Number(value['schoolId']) ;

      }
      if (value['advanceSearch']) {
        this.advanceSearch = value['advanceSearch'] == 'true';
        if (this.advanceSearch) {
          this.advanceSearchButtonText = 'Ẩn tra cứu nâng cao';
        } else {
          this.advanceSearchButtonText = 'Hiện tra cứu nâng cao';
        }
      }
    });
  }

  getStatusSeverity(statusId: any): string {
    const statusSeverityMap: { [key: number]: string } = {
      6: 'info',
      7: 'warning',
      8: 'success',
      9: 'danger',
    };
    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }

  ngOnInit(): void {
    for (const role of this.auth.getRoleFromJwt()) {
      if (role.authority === Role.PRINCIPAL) {
        this.isPrincipal = true;
        this.selectedSchool = this.auth.getSchoolFromJwt().schoolId;
      }
    }
    if (!this.isPrincipal) {
      this.schoolService.findAllSchools().subscribe({
        next: (data) => {
          this.schools = data;
        },
        error: (error) => {
          this.toastService.showError('error', 'Lỗi', error.error.message);
        },
      });
    }

    this.issueService.getIssueDropDownResponse().subscribe({
      next: (result) => {
        this.issueDropDowns = result.issueDropDownBoxDtos;
        this.initQuery();
        this.loadDocuments();
      },
      error: (error) => {
        this.toastService.showError('error', 'Lỗi', error.error.message);
      },
    });



  }

  loadDocuments() {
    this.initiationplanService
      .filterInitiationPlan(
        this.pageNo,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
        this.planName,
        this.selectedStatus,
        this.currentIssueSelected,
        this.selectedSchool,
        this.creationStartDateTime,
        this.creationEndDateTime,
        this.deadlineStartDateTime,
        this.deadlineEndDateTime
      )
      .subscribe({
        next: (data) => {
          this.schoolInitPlans = data.initiationPlanDtoPage.content;
          this.maxPage = data.initiationPlanDtoPage.totalPages;
          this.totalElements = data.initiationPlanDtoPage.totalElements;
          this.changePageSize();
          this.router.navigate([], {
            relativeTo: this.activateRouter,
            queryParams: {
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              sortBy: this.sortBy,
              sortDirection: this.sortDirection,
              planName: this.planName,
              currentIssueSelected: this.currentIssueSelected,
              deadlineStartDateTime: toIsoStringUrl(this.deadlineStartDateTime),
              deadlineEndDateTime: toIsoStringUrl(this.deadlineEndDateTime),
              creationStartDateTime: toIsoStringUrl(this.creationStartDateTime),
              creationEndDateTime: toIsoStringUrl(this.creationEndDateTime),
              schoolId: this.selectedSchool,
              advanceSearch: this.advanceSearch,
              status: this.selectedStatus
              // Add other query parameters as needed
            },
            queryParamsHandling: 'merge',
          });
        },
      });
  }

  onAdvanceSearch() {
    if (this.advanceSearch) {
      this.reset();
      this.advanceSearch = false;
      this.advanceSearchButtonText = 'Hiện tra cứu nâng cao';
    } else {
      this.reset();
      this.advanceSearch = true;
      this.advanceSearchButtonText = 'Ẩn tra cứu nâng cao';
    }
  }

  protected reset() {
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
    this.createDateRange = null;
    this.deadlineDateRange = null;
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

  onDetail(id: any) {
    if (this.isPrincipal) {
      this.router.navigate(['school-initiation-plan/school-side/' + id]);
    } else {
      this.router.navigate(['school-initiation-plan/' + id]);
    }
  }

  maxPageOnKeyUp() {
    if (this.pageNo > this.maxPage) {
      this.pageNo = this.maxPage;
      this.toastService.showWarn(
        'paging',
        'Thông báo',
        'Số trang bạn vừa tìm không thể vượt quá ' + this.maxPage
      );
    }
  }

  changePageSize() {
    if (
      this.schoolInitPlans.length == 0 &&
      this.pageNo > 1 &&
      this.totalElements > 0
    ) {
      this.pageNo = this.maxPage;
      this.loadDocuments();
    }
  }

  onTableDataChange($event: number) {
    this.pageNo = $event;
    this.loadDocuments();
  }

  changeStartDate() {
    if (this.createDateRange){
      this.creationStartDateTime = tuiDayToDate(this.createDateRange.from);
      this.creationEndDateTime = tuiDayToDate(this.createDateRange.to);
      this.loadDocuments();
    }

  }

  changeDeadlineDate() {
    if (this.deadlineDateRange){
      this.deadlineStartDateTime = tuiDayToDate(this.deadlineDateRange.from);
      this.deadlineEndDateTime = tuiDayToDate(this.deadlineDateRange.to);
      this.loadDocuments();
    }

  }
}
