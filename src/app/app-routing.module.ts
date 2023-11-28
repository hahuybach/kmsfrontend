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
import { SchoolListComponent } from './features/post-login/school-list/school-list.component';
import { SchoolDetailComponent } from './features/post-login/school-list/school-detail/school-detail.component';
import { SchoolCreateComponent } from './features/post-login/school-list/school-create/school-create.component';
import { SchoolUpdateComponent } from './features/post-login/school-list/school-update/school-update.component';
import { UserListComponent } from './features/post-login/user-list/user-list.component';
import { UserDetailComponent } from './features/post-login/user-list/user-detail/user-detail.component';
import { UserCreateComponent } from './features/post-login/user-list/user-create/user-create.component';
import { AssignAssignmentComponent } from './features/post-login/school-side/assignment/assign-assignment/assign-assignment.component';
import { UpdateInspectionPlanComponent } from './features/post-login/inspection-plan-list/update-inspection-plan/update-inspection-plan.component';
import { UserUpdateComponent } from './features/post-login/user-list/user-update/user-update.component';
import { AssignmentTreeListComponent } from './features/post-login/assignment/assignment-tree-list/assignment-tree-list.component';

import { InspectionComponent } from './features/post-login/inspection/inspection.component';
import { InspectionInformationComponent } from './features/post-login/inspection/inspection-information/inspection-information.component';
import { InspectionSchoolDocumentComponent } from './features/post-login/inspection/inspection-school-document/inspection-school-document.component';
import { InspectionDocumentComponent } from './features/post-login/inspection/inspection-document/inspection-document.component';
import { AssignmentDetailComponent } from './features/post-login/assignment/assignment-detail/assignment-detail.component';
import {
  InspectionMytaskComponent
} from "./features/post-login/inspection/inspection-mytask/inspection-mytask.component";

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
      {
        path: 'inspection_plan/update/:id',
        component: UpdateInspectionPlanComponent,
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
        path: 'createtemplate',
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
        path: 'schoolList',
        component: SchoolListComponent,
      },
      {
        path: 'school/:id',
        component: SchoolDetailComponent,
      },
      {
        path: 'schools/create',
        component: SchoolCreateComponent,
      },
      {
        path: 'school/:id/update',
        component: SchoolUpdateComponent,
      },
      {
        path: 'userList',
        component: UserListComponent,
      },
      {
        path: 'userList/:id',
        component: UserDetailComponent,
      },
      {
        path: 'users/create',
        component: UserCreateComponent,
      },
      {
        path: 'assignassignment/:issueId',
        component: AssignAssignmentComponent,
      },
      {
        path: 'user/:id/update',
        component: UserUpdateComponent,
      },
      {
        path: 'listAssignment',
        component: AssignmentTreeListComponent,
      },
      {
        path: 'detailAssignment',
        component: AssignmentDetailComponent,
      },
      {
        path: 'inspection/:id',
        component: InspectionComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'information'
          },
          {
            path: 'information',
            component: InspectionInformationComponent,
          },
          {
            path: 'school-document',
            component: InspectionSchoolDocumentComponent,
          },
          {
            path: 'document',
            component: InspectionDocumentComponent,
          },
          {
            path: 'my-task',
            component: InspectionMytaskComponent
          }
        ]
      }
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
