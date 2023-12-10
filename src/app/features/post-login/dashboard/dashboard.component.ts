import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StompService } from '../push-notification/stomp.service';
import { switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SchoolService } from '../../../services/school.service';
import { inspectionPlanService } from '../../../services/inspectionplan.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { IssueService } from '../../../services/issue.service';
import { IssueResponse } from '../../../models/issue-response';
import { unSub } from '../../../shared/util/util';
import { InitiationplanService } from '../../../services/initiationplan.service';
import { AssignmentService } from '../../../services/assignment.service';

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

  constructor(
    private schoolService: SchoolService,
    private inspectionPlanService: inspectionPlanService,
    private toastService: ToastService,
    private issueService: IssueService,
    private router: Router,
    private initiationPlanService: InitiationplanService,
    private assignmentService: AssignmentService
  ) {}

  setInitiationPlanChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.initiationPlanDataChart = {
      labels: [
        'Đang thực thi',
        'Chờ phê duyệt',
        'Phê duyệt',
        'Không phê duyệt',
      ],
      datasets: [
        {
          data: [
            this.numberOfIniPlanInProgress,
            this.numberOfIniPlanWait,
            this.numberOfIniPlanApprove,
            this.numberOfIniPlanNotApprove,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--purple-500'), // New color
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--purple-400'), // New color
          ],
        },
      ],
    };

    this.initiationPlanOptionsChart = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  setInspectionPlanChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.inspectionPlanDataChart = {
      labels: ['Chưa bắt đầu', 'Đang tiến hành', 'Hoàn thành'],
      datasets: [
        {
          data: [
            this.numberOfNotStartedInspectionPlan,
            this.numberOfInProgressInspectionPlan,
            this.numberOfCompletedInspectionPlan,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
          ],
        },
      ],
    };

    this.inspectionPlanOptionsChart = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  ngOnInit(): void {
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
              this.toastService.showError(
                'dashboard-toast',
                'Lỗi',
                error.error.message
              );
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
      },
      error: (error) => {
        this.toastService.showError(
          'dashboard-toast',
          'Lỗi',
          error.error.mesage
        );
      },
    });
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
    this.router.navigate(['listAssignment'], {
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

  viewMyInspection() {}

  viewTreeList() {
    this.router.navigate(['listAssignment']);
  }

  viewTemplate() {
    this.router.navigate(['create-template']);
  }
}
