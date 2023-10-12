import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueListComponent } from './features/post-login/issue-list/issue-list.component';
import { DashboardComponent } from './features/post-login/dashboard/dashboard.component';
import { IssueDetailComponent } from './features/post-login/issue-list/issue-detail/issue-detail.component';
import { CreateIssueComponent } from './features/post-login/issue-list/create-issue/create-issue.component';
import { MainComponent } from './main/main/main.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {path:"",component: MainComponent,children: [{path:"issuelist", component: IssueListComponent },
  {path:"issuelist/:id", component: IssueDetailComponent},
  {path:"dashboard",component: DashboardComponent},
  {path:"createissue",component:CreateIssueComponent}]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
