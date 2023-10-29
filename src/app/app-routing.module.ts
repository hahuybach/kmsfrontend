import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IssueListComponent} from './features/post-login/issue-list/issue-list.component';
import {DashboardComponent} from './features/post-login/dashboard/dashboard.component';
import {IssueDetailComponent} from './features/post-login/issue-list/issue-detail/issue-detail.component';
import {CreateIssueComponent} from './features/post-login/issue-list/create-issue/create-issue.component';
import {MainComponent} from './main/main/main.component';
import {LoginFormComponent} from './features/login/login-form/login-form.component';
import {LoginBaseComponent} from './features/login/login-base/login-base.component';
import {ForgotPasswordComponent} from './features/login/forgot-password/forgot-password.component';
import {InspectionPlanListComponent} from './features/post-login/inspection-plan-list/inspection-plan-list.component';
import {
  CreateInspectionPlanComponent
} from './features/post-login/inspection-plan-list/create-inspection-plan/create-inspection-plan.component';
import {UpdateIssueComponent} from './features/post-login/issue-list/update-issue/update-issue.component';
import {PagenotfoundComponent} from './components/pagenotfound/pagenotfound.component';
import {
  SchoolInitiationPlanDetailComponent
} from './features/post-login/school-initiation-plan/school-initiation-plan-detail/school-initiation-plan-detail.component';
import {AuthGuard} from "./shared/guards/AuthGuard/auth.guard";
import {
  InspectionPlanDetailComponent
} from "./features/post-login/inspection-plan-list/inspection-plan-detail/inspection-plan-detail.component";

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
      {path: 'issuelist', component: IssueListComponent},
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
      {path: 'inspection_plan', component: InspectionPlanListComponent},
      {
        path: 'inspection_plan/create',
        component: CreateInspectionPlanComponent,
      },
      {
        path: 'inspection_plan/:id',
        component: InspectionPlanDetailComponent
      },
      // school initiation plan
      {
        path: 'schoolinitiationplan/:id',
        component: SchoolInitiationPlanDetailComponent,
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
