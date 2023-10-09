import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueListComponent } from './features/post-login/issue-list/issue-list.component';
import { DashboardComponent } from './features/post-login/dashboard/dashboard.component';
import { IssueDetailComponent } from './features/post-login/issue-list/issue-detail/issue-detail.component';

const routes: Routes = [
  {path:"issuelist", component: IssueListComponent},
  {path:"issuelist/:id", component: IssueDetailComponent},
  {path:"dashboard",component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
