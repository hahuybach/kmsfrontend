import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueListComponent } from './features/post-login/issue-list/issue-list.component';
import { DashboardComponent } from './features/post-login/dashboard/dashboard.component';
import { IssueDetailComponent } from './features/post-login/issue-list/issue-detail/issue-detail.component';
import { CreateIssueComponent } from './features/post-login/issue-list/create-issue/create-issue.component';
import { MainComponent } from './main/main/main.component';
import { LoginFormComponent } from './features/login/login-form/login-form.component';
import { LoginBaseComponent } from './features/login/login-base/login-base.component';
import { ForgotPasswordComponent } from './features/login/forgot-password/forgot-password.component';
import { InspectionPlanListComponent } from './features/post-login/inspection-plan-list/inspection-plan-list.component';
import { CreateInspectionPlanComponent } from './features/post-login/inspection-plan-list/create-inspection-plan/create-inspection-plan.component';
import { UpdateIssueComponent } from './features/post-login/issue-list/update-issue/update-issue.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { SchoolInitiationPlanDetailComponent } from './features/post-login/school-initiation-plan/school-initiation-plan-detail/school-initiation-plan-detail.component';
import { AuthGuard } from './shared/guards/AuthGuard/auth.guard';
import { InspectionPlanDetailComponent } from './features/post-login/inspection-plan-list/inspection-plan-detail/inspection-plan-detail.component';
import { InitiationPlanDetailComponent } from './features/post-login/school-side/initiation-plan/initiation-plan-detail/initiation-plan-detail.component';
import { GuidanceDocumentListComponent } from './features/post-login/guidance-document-list/guidance-document-list.component';
import { GuidanceDocumentDetailComponent } from './features/post-login/guidance-document-list/guidance-document-detail/guidance-document-detail.component';
import { GuidanceDocumentCreateComponent } from './features/post-login/guidance-document-list/guidance-document-create/guidance-document-create.component';
import { CreateAssignmentComponent } from './features/post-login/assignment/create-assignment/create-assignment.component';
import { SchoolInitiationPlanListComponent } from './features/post-login/school-initiation-plan/school-initiation-plan-list/school-initiation-plan-list.component';
import { AssignmentListComponent } from './features/post-login/school-side/assignment/assignment-list/assignment-list.component';
import { SubmitAssignmentComponent } from './features/post-login/school-side/assignment/submit-assignment/submit-assignment.component';
import { ApproveAssignmentComponent } from './features/post-login/school-side/assignment/approve-assignment/approve-assignment.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      // issue
      { path: 'issuelist', component: IssueListComponent },
      {
        path: 'issuelist/:id',
        component: IssueDetailComponent,
      },
      {
        path: 'issuelist/update/:id',
        component: UpdateIssueComponent,
      },
      {
        path: 'createissue',
        component: CreateIssueComponent,
      },
      // dashboard
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      // initiationplan
      { path: 'inspection_plan', component: InspectionPlanListComponent },
      {
        path: 'inspection_plan/create',
        component: CreateInspectionPlanComponent,
      },
      {
        path: 'inspection_plan/:id',
        component: InspectionPlanDetailComponent,
      },
      // school initiation plan
      {
        path: 'schoolinitiationplan/:id',
        component: SchoolInitiationPlanDetailComponent,
      },
      {
        path: 'guidanceDocument',
        component: GuidanceDocumentListComponent,
      },
      {
        path: 'guidanceDocument/:id',
        component: GuidanceDocumentDetailComponent,
      },
      {
        path: 'guidanceDocument/create/:issueId',
        component: GuidanceDocumentCreateComponent,
      },
      {
        path: 'schoolinitiationplan',
        component: SchoolInitiationPlanListComponent,
      },
      {
        path: 'initiationplan/:id',
        component: InitiationPlanDetailComponent,
      },
      {
        path: 'assignment/create',
        component: CreateAssignmentComponent,
      },
      {
        path: 'schoolassignment',
        component: AssignmentListComponent,
      },
      {
        path: 'submitassignment',
        component: SubmitAssignmentComponent,
      },
      {
        path: 'approveassignment',
        component: ApproveAssignmentComponent,
      },
    ],
  },
  {
    path: '',
    component: LoginBaseComponent,
    children: [
      {
        path: 'login',
        component: LoginFormComponent,
      },
      {
        path: 'forgot_password',
        component: ForgotPasswordComponent,
      },
    ],
  },
  {
    path: '**',
    component: PagenotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
