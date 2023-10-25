import { TagModule } from 'primeng/tag';
import { UpdateIssueComponent } from './features/post-login/issue-list/update-issue/update-issue.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InspectorService } from './services/inspector.service';
import { SchoolInitiationPlanDetailComponent } from './features/post-login/school-initiation-plan/school-initiation-plan-detail/school-initiation-plan-detail.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './features/login/login-form/login-form.component';
import { MainComponent } from './main/main/main.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { IssueListComponent } from './features/post-login/issue-list/issue-list.component';
import { DashboardComponent } from './features/post-login/dashboard/dashboard.component';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import {AgGridModule} from "ag-grid-angular";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { IssueService } from './services/issue.service';
import { LoggerService } from './services/LoggerService';
import { IssueDetailComponent } from './features/post-login/issue-list/issue-detail/issue-detail.component';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { CreateIssueComponent } from './features/post-login/issue-list/create-issue/create-issue.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ForgotPasswordComponent } from './features/login/forgot-password/forgot-password.component';
import { LoginBaseComponent } from './features/login/login-base/login-base.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth.interceptor';
import { FormDataService } from './services/formdata.service';
import { ConfirmationService } from 'primeng/api';
import {AuthGuard} from "./shared/guards/AuthGuard/auth.guard";
import { IssueListPopUpComponent } from './features/post-login/issue-list/create-issue/component/issue-list-pop-up/issue-list-pop-up.component';
import { IssueListRightSideComponent } from './features/post-login/issue-list/create-issue/component/issue-list-right-side/issue-list-right-side.component';
import { InspectionPlanInspectorPopupComponent } from './features/post-login/inspection-plan-list/component/inspection-plan-inspector-popup/inspection-plan-inspector-popup.component';
import { InspectionPlanInspectorListComponent } from './features/post-login/inspection-plan-list/component/inspection-plan-inspector-list/inspection-plan-inspector-list.component';
import {InspectionPlanModule} from "./features/post-login/inspection-plan-list/inspection-plan/inspection-plan.module";
import {SharedModule} from "./shared/shared.module";
@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    MainComponent,
    SidebarComponent,
    SearchbarComponent,
    IssueListComponent,
    DashboardComponent,
    IssueDetailComponent,
    CreateIssueComponent,
    ForgotPasswordComponent,
    LoginBaseComponent,
    UpdateIssueComponent,
    PagenotfoundComponent,
    SchoolInitiationPlanDetailComponent,
    IssueListPopUpComponent,
    IssueListRightSideComponent,
    InspectionPlanInspectorPopupComponent,
    InspectionPlanInspectorListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenuModule,
    ToastModule,
    BrowserAnimationsModule,
    BadgeModule,
    DropdownModule,
    HttpClientModule,
    VirtualScrollerModule,
    FileUploadModule,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    FontAwesomeModule,
    FormsModule,
    AgGridModule,
    InspectionPlanModule,
    SharedModule
  ],
  providers: [
    MessageService,
    IssueService,
    LoggerService,
    ConfirmationService,
    InspectorService,
    FormDataService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
