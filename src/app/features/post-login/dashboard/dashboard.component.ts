import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StompService} from '../push-notification/stomp.service';
import {switchMap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {SchoolService} from '../../../services/school.service';
import {inspectionPlanService} from '../../../services/inspectionplan.service';
import {ToastService} from '../../../shared/toast/toast.service';
import {IssueService} from '../../../services/issue.service';
import {IssueResponse} from '../../../models/issue-response';
import {unSub} from '../../../shared/util/util';
import {InitiationplanService} from '../../../services/initiationplan.service';
import {AssignmentService} from '../../../services/assignment.service';
import {Role} from '../../../shared/enum/role';
import {InspectionPlanResponse} from '../../../models/inspection-plan-response';
import {TaskTreeResponse} from '../../../models/task-tree-response';
import {DocumentService} from '../../../services/document.service';
import {GuidanceDocumentService} from '../../../services/guidance-document.service';
import {FilterGuidanceDocumentResponse} from '../../../models/filter-guidance-document-response';
import {tuiSum} from '@taiga-ui/cdk';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  subs: any[] = [];
  totalSchool: any;
  numberOfInspectedSchool: any;
  issue: IssueResponse;
  numberOfIniPlanInProgress: any;
  numberOfIniPlanWait: any;
  numberOfIniPlanApprove: any;
  numberOfIniPlanNotApprove: any;
  numberOfSchoolCompletedAssignment: any;
  initiationPlanDataChart: any;
  initiationPlanOptionsChart: any;
  inspectionPlanDataChart: any;
  inspectionPlanOptionsChart: any;
  numberOfNotStartedInspectionPlan: any;
  numberOfInProgressInspectionPlan: any;
  numberOfCompletedInspectionPlan: any;

  isDirector: boolean = false;
  isAdmin: boolean = false;
  isInspector: boolean = false;
  isChiefInspector: boolean = false;
  isViceDirector: boolean = false;
  isSchoolNormalEmp: boolean = false;
  isSpecialist: boolean = false;
  isPrincipal: boolean = false;
  schoolRoles: any[] = [
    Role.VICE_PRINCIPAL,
    Role.CHIEF_TEACHER,
    Role.CHIEF_OFFICE,
    Role.TEACHER,
    Role.ACCOUNTANT,
    Role.MEDIC,
    Role.CLERICAL_ASSISTANT,
    Role.SECURITY,
    Role.CHIEF_NUTRITION, Role.NUTRITION_EMP
  ];

  inspectionPlans: InspectionPlanResponse[];
  totalNumberOfInspectionPlan: any;

  inspectionPlanStatuses = [
    {label: 'Chưa bắt đầu', value: 19},
    {label: 'Đang tiến hành', value: 20},
    {label: 'Hoàn thành', value: 23},
  ];
  inspectionPlanSelectedStatus = 20;
  totalNumberOfAsm: any;
  selectedStatus = 15;
  statuses = [
    {label: 'Chưa hoàn thành', value: 14},
    {label: 'Hoàn thành', value: 15},
  ];

  taskTrees: TaskTreeResponse[];

  numberOfNotCompletedAsm: any;
  numberOfCompletedAsm: any;
  numberWaitingForApprovalAsm: any;
  numberApprovedAsm: any;
  numberDisApprovedAsm: any;
  totalAsm: any;

  // thống kế công việc của tôi
  myNumberOfNotCompletedAsm: any;
  myNumberOfCompletedAsm: any;
  myNumberWaitingForApprovalAsm: any;
  myNumberApprovedAsm: any;
  myNumberDisApprovedAsm: any;
  myTotalAsm: any;

  asmChartData: any;
  // thống kế công việc của tôi
  myAsmChartData: any;
  amsChartOptions: any;
  guidanceDocuments: FilterGuidanceDocumentResponse[];
  private readonly labels = [
    'Chưa hoàn thành',
    'Hoàn thành',
    'Đang chờ phê duyệt',
    'Phê duyệt',
    'Không phê duyệt',
  ];
  value: any[];
  index = NaN;
  index_inspection = NaN;
  index_init = NaN;
  index_asm = NaN;
  myIndex_asm = NaN;


  issueNotFound = false;

  sum(chart: any, index: number): number {
    if (Number.isNaN(index)) {
      if (chart && Array.isArray(chart.data)) {
        return this.sumArray(chart.data);
      }
    } else {
      if (chart && Array.isArray(chart.data) && chart.labels[index]) {
        return chart.data[index];
      }
    }
    return 0; // Or any other default value if the conditions are not met
  }

  label(chart: any, index: number): string {
    if (Number.isNaN(index)) {
      return 'Tổng số';
    } else if (chart && Array.isArray(chart.labels) && chart.labels[index]) {
      return chart.labels[index];
    }
    return ''; // Or any other default value if the conditions are not met
  }


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
        if (this.schoolRoles.some((value) => value === argument.authority)) {
          this.isSchoolNormalEmp = true;
        }
      }
    }
  }

  getStatusSeverity(statusId: any): string {
    const statusSeverityMap: { [key: number]: string } = {
      13: 'warning',
      14: 'danger',
      15: 'success',
      19: 'warning',
      20: 'info',
      21: 'danger',
      22: 'danger',
      23: 'success',
    };
    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }

  constructor(
    private schoolService: SchoolService,
    private inspectionPlanService: inspectionPlanService,
    private toastService: ToastService,
    private issueService: IssueService,
    private router: Router,
    private initiationPlanService: InitiationplanService,
    private assignmentService: AssignmentService,
    private auth: AuthService,
    private documentService: DocumentService,
    private guidanceDocumentService: GuidanceDocumentService
  ) {
  }

  setInitiationPlanChartData() {
    this.initiationPlanDataChart = {
      labels: [
        'Chờ phê duyệt',
        'Đang thực thi',
        'Phê duyệt',
        'Không phê duyệt',
      ],
      data: [
        this.numberOfIniPlanWait,
        this.numberOfIniPlanInProgress,
        this.numberOfIniPlanApprove,
        this.numberOfIniPlanNotApprove,
      ],
    };
    console.log(this.initiationPlanDataChart.data);
  }

  setInspectionPlanChartData() {
    this.inspectionPlanDataChart = {
      labels: ['Chưa bắt đầu', 'Đang tiến hành', 'Hoàn thành'],
      data: [
        this.numberOfNotStartedInspectionPlan,
        this.numberOfInProgressInspectionPlan,
        this.numberOfCompletedInspectionPlan,
      ],
    };
  }

  setAsmChartData() {
    this.asmChartData = {
      labels: [
        'Chưa hoàn thành',
        'Chờ phê duyệt',
        'Hoàn thành',
        'Không phê duyệt',
        // 'Phê duyệt',
      ],
      data: [
        this.numberOfNotCompletedAsm,
        this.numberWaitingForApprovalAsm,
        this.numberOfCompletedAsm + this.numberApprovedAsm,
        this.numberDisApprovedAsm,
      ],
    };
    console.log(this.asmChartData);
  }

  setMyAsmChartData() {
    this.myAsmChartData = {
      labels: [
        'Chưa hoàn thành',
        'Chờ phê duyệt',
        'Hoàn thành',
        'Không phê duyệt',
        'Phê duyệt',
      ],
      data: [
        this.myNumberOfNotCompletedAsm,
        this.myNumberWaitingForApprovalAsm,
        this.myNumberOfCompletedAsm,
        this.myNumberDisApprovedAsm,
        this.myNumberApprovedAsm
      ],
    };
  }


  setInitDataForDirector() {
    const sub1 = this.schoolService.getNumberOfSchools().subscribe({
      next: (data) => {
        this.totalSchool = data;
        console.log(this.totalSchool);
      },
      error: (error) => {
        this.toastService.showError(
          'dashboard-toast',
          'Lỗi',
          error.error.message
        );
      },
    });
    const sub2 = this.issueService.getCurrentActiveIssue().subscribe({
      next: (data) => {
        this.issue = data.issueDto;
        console.log(this.issue);
        const sub3 = this.inspectionPlanService
          .getNumberOfInspectedSchool(this.issue?.issueId)
          .subscribe({
            next: (data) => {
              this.numberOfInspectedSchool = data;
              console.log(this.numberOfInspectedSchool);
            },
            error: (error) => {
              this.issueNotFound = true;
            },
          });
        const sub4 = this.initiationPlanService
          .getDashBoardInitiationPlanResponse(this.issue?.issueId)
          .subscribe({
            next: (data) => {
              this.numberOfIniPlanInProgress = data.numberOfIniPlanInProgress;
              this.numberOfIniPlanWait = data.numberOfIniPlanWait;
              this.numberOfIniPlanApprove = data.numberOfIniPlanApprove;
              this.numberOfIniPlanNotApprove = data.numberOfIniPlanNotApprove;
              this.setInitiationPlanChartData();
              console.log(data);
            },
            error: (error) => {
              this.toastService.showError(
                'dashboard-toast',
                'Lỗi',
                error.error.message
              );
            },
          });
        const sub5 = this.assignmentService
          .getNumberOfCompletedAssignment(this.issue?.issueId)
          .subscribe({
            next: (data) => {
              this.numberOfSchoolCompletedAssignment = data;
              console.log(this.numberOfSchoolCompletedAssignment);
            },
            error: (error) => {
              this.toastService.showError(
                'dashboard-toast',
                'Lỗi',
                error.error.message
              );
            },
          });

        const sub6 = this.inspectionPlanService
          .getDashboardInspectionPlanResponse(this.issue?.issueId)
          .subscribe({
            next: (data) => {
              this.numberOfNotStartedInspectionPlan =
                data.numberOfNotStartedInspectionPlan;
              this.numberOfInProgressInspectionPlan =
                data.numberOfInProgressInspectionPlan;
              this.numberOfCompletedInspectionPlan =
                data.numberOfCompletedInspectionPlan;
              this.setInspectionPlanChartData();
              console.log(data);
            },
            error: (error) => {
              this.toastService.showError(
                'dashboard-toast',
                'Lỗi',
                error.error.message
              );
            },
          });
        this.subs.push(sub3);
        this.subs.push(sub4);
        this.subs.push(sub5);
        this.subs.push(sub6);
      },
      error: (error) => {
        this.toastService.showError(
          'dashboard-toast',
          'Lỗi',
          error.error.mesage
        );
      },
    });
    this.subs.push(sub1);
    this.subs.push(sub2);
  }

  setInitDataForSpecialist() {
    const sub = this.issueService.getCurrentActiveIssue().subscribe({
      next: (data) => {
        this.issue = data.issueDto;
        const sub2 = this.inspectionPlanService
          .filterInspectionPlan(
            0,
            3,
            'startDate',
            'desc',
            '',
            20,
            this.issue?.issueId,
            null,
            null,
            null,
            null,
            null,
            true
          )
          .subscribe({
            next: (data) => {
              this.inspectionPlans = data.inspectionPlanFilterDtos.content;
              this.totalNumberOfInspectionPlan =
                data.inspectionPlanFilterDtos.totalElements;
              console.log(this.inspectionPlans);
            },
            error: (error) => {
              this.issueNotFound = true;
              this.toastService.showError(
                'dashboard-toast',
                'Lỗi',
                error.error.message
              );
            },
          });
        this.subs.push(sub2);
      },
      error: (error) => {
        this.issueNotFound = true;
      },
    });
    this.subs.push(sub);
  }

  setInitDataForPrincipal() {
    this.issueService.getCurrentActiveIssue().subscribe({
      next: (data) => {
        this.issue = data.issueDto;
        this.inspectionPlanService
          .filterInspectionPlan(
            0,
            3,
            'startDate',
            'desc',
            '',
            this.inspectionPlanSelectedStatus,
            this.issue?.issueId,
            null,
            null,
            null,
            null,
            null,
            true
          )
          .subscribe({
            next: (data) => {
              this.inspectionPlans = data.inspectionPlanFilterDtos.content;
              this.totalNumberOfInspectionPlan =
                data.inspectionPlanFilterDtos.totalElements;
            },
            error: (error) => {
              this.issueNotFound = true;
            },
          });

        this.loadAsm();
        this.getAssignmentDashboardResponse();
        this.getMyAssignmentDashboardResponse()
        this.getGuidanceDocument();
      },
      error: (error) => {
        this.toastService.showError(
          'dashboard-toast',
          'Lỗi',
          error.error.message
        );
      },
    });
  }

  ngOnInit(): void {
    this.setAuth();
    if (this.isDirector) {
      this.setInitDataForDirector();
    }
    if (this.isSpecialist) {
      this.setInitDataForSpecialist();
    }
    if (this.isPrincipal || this.isSchoolNormalEmp) {
      this.setInitDataForPrincipal();
    }
  }

  ngOnDestroy(): void {
    unSub(this.subs);
  }

  createInspectionPlan() {
    this.router.navigate(['inspection-plan/create']);
  }

  viewInitiationPlanList() {
    this.router.navigate(['school-initiation-plan/list'], {
      queryParams: {
        advanceSearch: true,
        status: 7,
        pageNo: 1,
        pageSize: 5,
        sortBy: 'createdDate',
        sortDirection: 'desc',
        currentIssueSelected: this.issue?.issueId,
      },
    });
  }

  viewCompletedSchoolAssignmentList() {
    this.router.navigate(['list-assignment'], {
      queryParams: {
        advanceSearch: true,
        status: 15,
        pageNo: 1,
        pageSize: 5,
        sortBy: 'createdDate',
        sortDirection: 'desc',
        currentIssueSelected: this.issue?.issueId,
      },
    });
  }

  createGuidanceDocument() {
    this.router.navigate(['guidance-document/create/1']);
  }

  viewMyInspection() {
    this.router.navigate(['inspection-plan/list'], {
      queryParams: {
        advanceSearch: true,
        pageNo: 1,
        pageSize: 5,
        sortBy: 'createdDate',
        sortDirection: 'desc',
        isMine: true,
        status: this.inspectionPlanSelectedStatus,
      },
    });
  }

  viewTreeList() {
    this.router.navigate(['listAssignment']);
  }

  viewTemplate() {
    this.router.navigate(['create-template']);
  }

  viewInspectionDetail(inspectionId: any) {
    this.router.navigate(['inspection-plan/' + inspectionId]);
  }

  viewIssueDetail() {
    this.router.navigate(['issue/' + this.issue?.issueId]);
  }

  loadInspectionPlan() {
    this.inspectionPlanService
      .filterInspectionPlan(
        0,
        3,
        'startDate',
        'desc',
        '',
        this.inspectionPlanSelectedStatus,
        this.issue?.issueId,
        null,
        null,
        null,
        null,
        null,
        true
      )
      .subscribe({
        next: (data) => {
          this.inspectionPlans = data.inspectionPlanFilterDtos.content;
          this.totalNumberOfInspectionPlan =
            data.inspectionPlanFilterDtos.totalElements;
        },
      });
  }

  loadAsm() {
    if (this.isPrincipal){
      const sub = this.documentService
        .filterAsm(
          0,
          3,
          'History.createdDate',
          'desc',
          '',
          this.selectedStatus,
          this.issue?.issueId,
            this.auth.getSchoolFromJwt().schoolId,
            false

        )
        .subscribe({
          next: (data) => {
            this.taskTrees = data.taskTreeDtos.content;
            this.totalNumberOfAsm = data.taskTreeDtos.totalElements;
            console.log(data);
          },
        });
      this.subs.push(sub);
    }else{
      const sub = this.documentService
        .filterAsm(
            0,
            3,
            'History.createdDate',
            'desc',
            '',
            this.selectedStatus,
            this.issue?.issueId,
            this.auth.getSchoolFromJwt().schoolId,
            false, this.auth.getSubFromCookie()
        )
        .subscribe({
          next: (data) => {
            this.taskTrees = data.taskTreeDtos.content;
            this.totalNumberOfAsm = data.taskTreeDtos.totalElements;
            console.log(data);
          },
        });
      this.subs.push(sub);
    }

  }

  viewAsmDetail(rootAssignmentId: any) {
    this.router.navigate(['assign-assignment/'+ this.issue?.issueId], {
      queryParams: { id: rootAssignmentId },
    })

  }

  viewAsmTree() {
    this.router.navigate(['assign-assignment/' + this.issue?.issueId]);
  }

  viewSchoolInspection() {
    this.router.navigate(['inspection-plan/list'], {
      queryParams: {
        advanceSearch: true,
        pageNo: 1,
        pageSize: 5,
        sortBy: 'createdDate',
        sortDirection: 'desc',
        schoolId: this.auth.getSchoolFromJwt().schoolId,
      },
    });
  }

  getAssignmentDashboardResponse() {
    const sub = this.assignmentService
      .getAssignmentDashboardResponse(this.issue.issueId, false)
      .subscribe({
        next: (data) => {
          this.numberOfNotCompletedAsm = data.numberOfNotCompletedAsm;
          this.numberOfCompletedAsm = data.numberOfCompletedAsm;
          this.numberWaitingForApprovalAsm = data.numberWaitingForApprovalAsm;
          this.numberApprovedAsm = data.numberApprovedAsm;
          this.numberDisApprovedAsm = data.numberDisApprovedAsm;
          this.totalAsm = data.totalAsm;
          this.setAsmChartData();
        },
        error: (error) => {
          this.toastService.showError(
            'dashboard-toast',
            'Lỗi',
            error.error.message
          );
        },
      });
    this.subs.push(sub);
  }

  getMyAssignmentDashboardResponse() {
    const sub = this.assignmentService
      .getAssignmentDashboardResponse(this.issue.issueId, true)
      .subscribe({
        next: (data) => {
          this.myNumberOfNotCompletedAsm = data.numberOfNotCompletedAsm;
          this.myNumberOfCompletedAsm = data.numberOfCompletedAsm;
          this.myNumberWaitingForApprovalAsm = data.numberWaitingForApprovalAsm;
          this.myNumberApprovedAsm = data.numberApprovedAsm;
          this.myNumberDisApprovedAsm = data.numberDisApprovedAsm;
          this.myTotalAsm = data.totalAsm;
          this.setMyAsmChartData();
        },
        error: (error) => {
          this.toastService.showError(
            'dashboard-toast',
            'Lỗi',
            error.error.message
          );
        },
      });
    this.subs.push(sub);
  }

  getGuidanceDocument() {
    const sub = this.guidanceDocumentService
      .filterGuidanceDocuments(
        0,
        3,
        'createdDate',
        'desc',
        '',
        '',
        null,
        null,
        '',
        this.issue.issueId,
        ''
      )
      .subscribe({
        next: (data) => {
          this.guidanceDocuments = data.guidanceDocumentDtos;
          console.log('guidance ' + data);
        },
        error: (error) => {
          this.toastService.showError(
            'dashboard-toast',
            'Lỗi',
            error.error.message
          );
        },
      });
    this.subs.push(sub);
  }

  viewGuidanceDocumentDetail(guidanceDocumentId: any) {
    this.router.navigate(['guidance-document/' + guidanceDocumentId]);
  }

  sumArray<T>(array: T[]): number {
    if (array.length === 0) {
      return 0; // Return 0 for an empty array or an appropriate value for your use case
    }

    // Use the reduce function to calculate the sum
    return array.reduce((acc, value) => {
      if (typeof value === 'number') {
        return acc + value;
      } else {
        // Handle non-numeric values (e.g., strings)
        return acc;
      }
    }, 0);
  }

  protected readonly NaN = NaN;
}
