import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IssueListComponent} from './features/post-login/issue/issue-list/issue-list.component';
import {DashboardComponent} from './features/post-login/dashboard/dashboard.component';
import {IssueDetailComponent} from './features/post-login/issue/issue-detail/issue-detail.component';
import {CreateIssueComponent} from './features/post-login/issue/create-issue/create-issue.component';
import {MainComponent} from './main/main/main.component';
import {LoginFormComponent} from './features/login/login-form/login-form.component';
import {LoginBaseComponent} from './features/login/login-base/login-base.component';
import {ForgotPasswordComponent} from './features/login/forgot-password/forgot-password.component';
import {
  InspectionPlanListComponent
} from './features/post-login/inspection-plan/inspection-plan-list/inspection-plan-list.component';
import {
  CreateInspectionPlanComponent
} from './features/post-login/inspection-plan/create-inspection-plan/create-inspection-plan.component';
import {UpdateIssueComponent} from './features/post-login/issue/update-issue/update-issue.component';
import {PagenotfoundComponent} from './components/pagenotfound/pagenotfound.component';
import {
  SchoolInitiationPlanDetailComponent
} from './features/post-login/school-initiation-plan/school-initiation-plan-detail/school-initiation-plan-detail.component';
import {AuthGuard} from './shared/guards/AuthGuard/auth.guard';
import {
  InspectionPlanDetailComponent
} from './features/post-login/inspection-plan/inspection-plan-detail/inspection-plan-detail.component';
import {
  InitiationPlanDetailComponent
} from './features/post-login/school-side/initiation-plan/initiation-plan-detail/initiation-plan-detail.component';
import {
  GuidanceDocumentListComponent
} from './features/post-login/guidance-document/guidance-document-list/guidance-document-list.component';
import {
  GuidanceDocumentDetailComponent
} from './features/post-login/guidance-document/guidance-document-detail/guidance-document-detail.component';
import {
  GuidanceDocumentCreateComponent
} from './features/post-login/guidance-document/guidance-document-create/guidance-document-create.component';
import {
  CreateAssignmentComponent
} from './features/post-login/assignment/create-assignment/create-assignment.component';
import {
  SchoolInitiationPlanListComponent
} from './features/post-login/school-initiation-plan/school-initiation-plan-list/school-initiation-plan-list.component';
import {
  AssignmentListComponent
} from './features/post-login/school-side/assignment/assignment-list/assignment-list.component';
import {SchoolListComponent} from './features/post-login/school/school-list/school-list.component';
import {SchoolDetailComponent} from './features/post-login/school/school-detail/school-detail.component';
import {SchoolCreateComponent} from './features/post-login/school/school-create/school-create.component';
import {SchoolUpdateComponent} from './features/post-login/school/school-update/school-update.component';
import {UserListComponent} from './features/post-login/user/user-list/user-list.component';
import {UserDetailComponent} from './features/post-login/user/user-detail/user-detail.component';
import {UserCreateComponent} from './features/post-login/user/user-create/user-create.component';
import {
  AssignAssignmentComponent
} from './features/post-login/school-side/assignment/assign-assignment/assign-assignment.component';
import {
  UpdateInspectionPlanComponent
} from './features/post-login/inspection-plan/update-inspection-plan/update-inspection-plan.component';
import {UserUpdateComponent} from './features/post-login/user/user-update/user-update.component';
import {
  AssignmentTreeListComponent
} from './features/post-login/assignment/assignment-tree-list/assignment-tree-list.component';

import {InspectionComponent} from './features/post-login/inspection/inspection.component';
import {
  InspectionInformationComponent
} from './features/post-login/inspection/inspection-information/inspection-information.component';
import {
  InspectionSchoolDocumentComponent
} from './features/post-login/inspection/inspection-school-document/inspection-school-document.component';
import {
  InspectionDocumentComponent
} from './features/post-login/inspection/inspection-document/inspection-document.component';
import {
  AssignmentDetailComponent
} from './features/post-login/assignment/assignment-detail/assignment-detail.component';
import {
  InspectionMytaskComponent
} from './features/post-login/inspection/inspection-mytask/inspection-mytask.component';
import {IssueBaseComponent} from './features/post-login/issue/issue-base/issue-base.component';
import {
  InspectionPlanBaseComponent
} from './features/post-login/inspection-plan/inspection-plan-base/inspection-plan-base.component';
import {
  GuidanceDocumentBaseComponent
} from './features/post-login/guidance-document/guidance-document-base/guidance-document-base.component';
import {
  SchoolInitiationPlanBaseComponent
} from './features/post-login/school-initiation-plan/school-initiation-plan-base/school-initiation-plan-base.component';
import {SchoolBaseComponent} from './features/post-login/school/school-base/school-base.component';
import {UserBaseComponent} from './features/post-login/user/user-base/user-base.component';
import {InitiationPlanDetailGuardGuard} from './shared/guards/initiation-plan-detail-guard.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      // dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      //issue
      {
        path: 'issue',
        component: IssueBaseComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
          },
          {
            path: 'list',
            component: IssueListComponent,
          },
          {
            path: 'create',
            component: CreateIssueComponent,
          },
          {
            path: ':id',
            component: IssueDetailComponent,
          },
          {
            path: 'update/:id',
            component: UpdateIssueComponent,
          },
        ],
      },
      // inspection-plan
      {
        path: 'inspection-plan',
        component: InspectionPlanBaseComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
          },
          {
            path: 'list',
            component: InspectionPlanListComponent,
          },
          {
            path: 'create',
            component: CreateInspectionPlanComponent
          },
          {
            path: ':id',
            component: InspectionPlanDetailComponent,
          },
          {
            path: 'update/:id',
            component: UpdateInspectionPlanComponent,
          },
        ],
      },
      // school initiation plan
      {
        path: 'school-initiation-plan',
        component: SchoolInitiationPlanBaseComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
          },

          {
            path: 'list',
            component: SchoolInitiationPlanListComponent,
          },
          {
            path: ':id',
            canActivate: [InitiationPlanDetailGuardGuard],
            component: SchoolInitiationPlanDetailComponent,
          },
          {
            path: 'school-side/:id',
            canActivate: [InitiationPlanDetailGuardGuard],
            component: InitiationPlanDetailComponent,
          },
        ],
      },
      //guidance-document
      {
        path: 'guidance-document',
        component: GuidanceDocumentBaseComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
          },
          {
            path: 'list',
            component: GuidanceDocumentListComponent,
          },
          {
            path: ':id',
            component: GuidanceDocumentDetailComponent,
          },
          {
            path: 'create/:issueId',
            component: GuidanceDocumentCreateComponent,
          },
        ],
      },
      {
        path: 'create-template',
        component: CreateAssignmentComponent,
      },
      {
        path: 'schoolassignment',
        component: AssignmentListComponent,
      },
      //school
      {
        path: 'school',
        component: SchoolBaseComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
          },
          {
            path: 'list',
            component: SchoolListComponent,
          },
          {
            path: 'create',
            component: SchoolCreateComponent,
          },
          {
            path: ':id',
            component: SchoolDetailComponent,
          },
          {
            path: 'update/:id',
            component: SchoolUpdateComponent,
          },
        ],
      },
      {
        path: 'user',
        component: UserBaseComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
          },
          {
            path: 'list',
            component: UserListComponent,
          },
          {
            path: 'create',
            component: UserCreateComponent,
          },
          {
            path: ':id',
            component: UserDetailComponent,
          },
          {
            path: 'update/:id',
            component: UserUpdateComponent,
          },
        ],
      },
      {
        path: 'assign-assignment/:issueId',
        component: AssignAssignmentComponent,
      },
      {
        path: 'list-assignment',
        component: AssignmentTreeListComponent,
        children: [
          {
            path: 'detail-assignment',
            component: AssignmentDetailComponent,
          }
        ]
      },

      {
        path: 'inspection/:id',
        component: InspectionComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'information',
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
            component: InspectionMytaskComponent,
          },
        ],
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
export class AppRoutingModule {
}
