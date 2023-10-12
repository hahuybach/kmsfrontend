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

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
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
    path: '',
    component: MainComponent,
    children: [
      { path: 'issuelist', component: IssueListComponent },
      {
        path: 'issuelist/:id',
        component: IssueDetailComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'createissue',
        component: CreateIssueComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
