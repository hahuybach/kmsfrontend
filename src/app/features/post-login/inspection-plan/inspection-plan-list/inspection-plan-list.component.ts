import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {IssueDropDownResponse} from "../../../../models/issue-drop-down-response";
import {SchoolResponse} from "../../../../models/school-response";
import {SchoolService} from "../../../../services/school.service";
import {IssueService} from "../../../../services/issue.service";
import {ToastService} from "../../../../shared/toast/toast.service";
import {InspectionPlanResponse} from "../../../../models/inspection-plan-response";
import {AuthService} from "../../../../services/auth.service";
import {Role} from "../../../../shared/enum/role";
import {dateToTuiDay, toIsoStringUrl, tuiDayToDate, unSub} from "../../../../shared/util/util";
import {TuiDayRange} from "@taiga-ui/cdk";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-inspection-plan-list',
  templateUrl: './inspection-plan-list.component.html',
  styleUrls: ['./inspection-plan-list.component.scss'],
})
export class InspectionPlanListComponent implements OnInit, OnDestroy {
  inspectionPlans: InspectionPlanResponse[]
  advanceSearch = false;
  planName: any;
  issueDropDowns: IssueDropDownResponse[];
  currentIssueSelected: any;
  schools: SchoolResponse[];
  selectedSchool: any
  creationStartDateTime: any;
  creationEndDateTime: any;
  deadlineStartDateTime: any;
  deadlineEndDateTime: any;
  advanceSearchButtonText = "Hiện tra cứu nâng cao";

  isDirector: boolean = false;
  isAdmin: boolean = false;
  isInspector: boolean = false;
  isChiefInspector: boolean = false;
  isViceDirector: boolean = false;
  isSchoolNormalEmp: boolean = false;
  isSpecialist: boolean = false;
  schoolRoles: any[] = [Role.VICE_PRINCIPAL, Role.CHIEF_TEACHER, Role.CHIEF_OFFICE, Role.TEACHER,
    Role.ACCOUNTANT, Role.MEDIC, Role.CLERICAL_ASSISTANT, Role.SECURITY,   Role.CHIEF_NUTRITION, Role.NUTRITION_EMP]

  isMine: any;

  constructor(
    private readonly router: Router,
    private readonly inspectionPlanService: inspectionPlanService,
    private schoolService: SchoolService,
    private issueService: IssueService,
    private toastService: ToastService,
    private auth: AuthService,
    private activateRouter: ActivatedRoute
  ) {

  }

  statuses = [
    {label: 'Chưa bắt đầu', value: 19},
    {label: 'Đang tiến hành', value: 20},
    {label: 'Hoàn thành', value: 23}
    ,
  ];
  selectedStatus: any;
  pageNo: number = 1;
  pageSize: number = 5;
  sortBy: string = 'startDate';
  sortDirection: string = 'desc';
  totalElements: number;
  maxPage: any;
  recordPerPageOption: number[] = [5, 15, 25];
  isPrincipal = false;
  createDateRange: any;
  deadlineDateRange: any;
  subs: any[] = []
  isMineSelection =  [
    {label: 'Bao gồm tôi', value: true},
    {label: 'Không bao gồm tôi', value: false},
  ];

  setAuth() {
    if (this.auth.getRolesFromCookie()) {
      for (const argument of this.auth.getRoleFromJwt()) {
        if (argument.authority === Role.DIRECTOR) {
          this.isDirector = true;
        }
        if (argument.authority === Role.PRINCIPAL) {
          this.isPrincipal = true;
        }
        if (argument.authority === Role.ADMIN) {
          this.isAdmin = true;
        }
        if (argument.authority === Role.VICE_DIRECTOR) {
          this.isViceDirector = true;
        }
        if (argument.authority === Role.INSPECTOR) {
          this.isInspector = true;
        }
        if (argument.authority === Role.CHIEF_INSPECTOR) {
          this.isChiefInspector = true;
        }
        if (argument.authority === Role.SPECIALIST) {
          this.isSpecialist = true;
        }
        if (this.schoolRoles.some(value => value === argument.authority)) {
          this.isSchoolNormalEmp = true;
        }

      }

    }
  }

  initQuery() {
    this.activateRouter.queryParams.subscribe(
      value => {
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
        if (value['currentIssueSelected'] && value['currentIssueSelected'] !== undefined) {
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
        if (value['schoolId'] && value['schoolId'] !== undefined) {
          this.selectedSchool = Number(value['schoolId']);

        }

        if (value['status'] && value['status'] !== undefined) {
          this.selectedStatus = Number(value['status']);
        }
        if (value['isMine'] && value['isMine'] !== undefined && value['isMine'] == 'true') {
          this.isMine = true;
        }

        if (value['advanceSearch']) {
          this.advanceSearch = (value['advanceSearch'] == 'true')
          if (this.advanceSearch) {
            this.advanceSearchButtonText = "Ẩn tra cứu nâng cao"
          } else {
            this.advanceSearchButtonText = "Hiện tra cứu nâng cao"

          }
        }
      }
    )
  }

  getStatusSeverity(statusId: any): string {
    const statusSeverityMap: { [key: number]: string } = {
      19: 'warning',
      20: 'info',
      21: 'danger',
      22: 'danger',
      23: 'success',
    };
    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }

  ngOnInit(): void {
    this.setAuth()

    if (this.isDirector) {
      const sub = this.schoolService.findAllSchools().subscribe({
          next: (data) => {
            this.schools = data
          },
          error: (error) => {
            this.toastService.showError("error", "Lỗi", error.error.message)
          }
        }
      )
      this.subs.push(sub);
    } else {
      this.schoolService.getInspectedSchoolByInspectorEmail(this.auth.getSubFromCookie()).subscribe({
        next: (data) => {
          this.schools = data
        },
        error: (error) => {
          this.toastService.showError("error", "Lỗi", error.error.message)
        }
      })
    }
    const sub2 = this.issueService.getIssueDropDownResponse()
      .subscribe({
        next: (result) => {
          this.issueDropDowns = result.issueDropDownBoxDtos;
          this.initQuery()
          this.loadDocuments();

        },
        error: (error) => {
          this.toastService.showError("error", "Lỗi", error.error.message)
        }
      })
    this.subs.push(sub2)
  }


  loadDocuments() {
    if (!(this.isPrincipal || this.isDirector)){
      this.isMine = true;
    }
    const sub = this.inspectionPlanService.filterInspectionPlan(this.pageNo, this.pageSize, this.sortBy,
      this.sortDirection, this.planName, this.selectedStatus, this.currentIssueSelected, this.selectedSchool,
      this.creationStartDateTime, this.creationEndDateTime, this.deadlineStartDateTime, this.deadlineEndDateTime, this.isMine).subscribe({
      next: (data) => {
        this.inspectionPlans = data.inspectionPlanFilterDtos.content;
        this.maxPage = data.inspectionPlanFilterDtos.totalPages;
        this.totalElements = data.inspectionPlanFilterDtos.totalElements;
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
            advanceSearch: this.advanceSearch,
            status: this.selectedStatus,
            schoolId: this.selectedSchool,
            isMine: this.isMine


            // Add other query parameters as needed
          },
          queryParamsHandling: 'merge'
        });
      }
    })
    this.subs.push(sub)
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
    this.isMine = null;
    if ((this.isPrincipal || this.isDirector)){
      this.isMine = true
    }
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

  onDetail(initiationPlanId: any) {
    this.router.navigate(['inspection-plan/' + initiationPlanId])
  }

  onUpdate(initiationPlanId: any) {
    this.router.navigate(['inspection-plan/update/' + initiationPlanId])
  }


  maxPageOnKeyUp() {
    if (this.pageNo > this.maxPage) {
      this.pageNo = this.maxPage;
      this.toastService.showWarn('paging', "Thông báo", 'Số trang bạn vừa tìm không thể vượt quá ' + this.maxPage)
    }
  }

  changePageSize() {
    if (this.inspectionPlans.length == 0 && this.pageNo > 1 && this.totalElements > 0) {
      this.pageNo = this.maxPage;
      this.loadDocuments();
    }
  }

  onTableDataChange($event: number) {
    this.pageNo = $event;
    this.loadDocuments()
  }

  onCreateInspectionPlan() {
    this.router.navigate(['inspection-plan/create'])
  }

  changeStartDate() {
    if (this.createDateRange) {
      this.creationStartDateTime = tuiDayToDate(this.createDateRange.from);
      this.creationEndDateTime = tuiDayToDate(this.createDateRange.to);
      this.loadDocuments();
    }

  }

  changeDeadlineDate() {
    if (this.deadlineDateRange) {
      this.deadlineStartDateTime = tuiDayToDate(this.deadlineDateRange.from);
      this.deadlineEndDateTime = tuiDayToDate(this.deadlineDateRange.to);
      this.loadDocuments();
    }

  }

  ngOnDestroy(): void {
    unSub(this.subs)
  }


  onInspectingDetail(inspectionPlanId: any) {
    this.router.navigate(['inspection/' + inspectionPlanId])
  }
}
