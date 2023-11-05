import { UpdateIssueComponent } from './features/post-login/issue-list/update-issue/update-issue.component';
import { InspectorService } from './services/inspector.service';
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
import { MenuModule } from 'primeng/menu';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { IssueService } from './services/issue.service';
import { LoggerService } from './services/LoggerService';
import { IssueDetailComponent } from './features/post-login/issue-list/issue-detail/issue-detail.component';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { CreateIssueComponent } from './features/post-login/issue-list/create-issue/create-issue.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ForgotPasswordComponent } from './features/login/forgot-password/forgot-password.component';
import { LoginBaseComponent } from './features/login/login-base/login-base.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './shared/interceptor/auth_interceptor/auth.interceptor';
import { FormDataService } from './services/formdata.service';
import { ConfirmationService } from 'primeng/api';
import { AuthGuard } from './shared/guards/AuthGuard/auth.guard';
import { IssueListPopUpComponent } from './features/post-login/issue-list/create-issue/component/issue-list-pop-up/issue-list-pop-up.component';
import { IssueListRightSideComponent } from './features/post-login/issue-list/create-issue/component/issue-list-right-side/issue-list-right-side.component';
import { SortByIdPipe } from '../app/shared/pipes/sortByDocumentTypeIdPipe.pipe';
import { InspectionPlanModule } from './features/post-login/inspection-plan-list/inspection-plan/inspection-plan.module';
import { SharedModule } from './shared/shared.module';
import { DatePipe } from '@angular/common';
import { SchoolInitiationPlanModule } from './features/post-login/school-initiation-plan/school-initiation-plan.module';
import { TokenExpirationInterceptor } from './shared/interceptor/token_expiration_inceptor/token-expiration.interceptor';
import { GuidanceDocumentListComponent } from './features/post-login/guidance-document-list/guidance-document-list.component';
import { GuidanceDocumentDetailComponent } from './features/post-login/guidance-document-list/guidance-document-detail/guidance-document-detail.component';
import { GuidanceDocumentFilesComponent } from './features/post-login/guidance-document-list/guidance-document-detail/guidance-document-files/guidance-document-files.component';
import { InitiationPlanModule } from './features/post-login/school-side/initiation-plan/initiation-plan.module';
import {NgxPaginationModule} from "ngx-pagination";
import {ToastModule} from "primeng/toast";
import { GuidanceDocumentCreateComponent } from './features/post-login/guidance-document-list/guidance-document-create/guidance-document-create.component';
import { AssignmentModule } from './features/post-login/assignment/assignment.module';
import { SchoolAssignmentModule } from './features/post-login/school-side/assignment/school-assignment.module';
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
    IssueListPopUpComponent,
    IssueListRightSideComponent,
    SortByIdPipe,
    GuidanceDocumentListComponent,
    GuidanceDocumentDetailComponent,
    GuidanceDocumentFilesComponent,
    GuidanceDocumentCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenuModule,
    BrowserAnimationsModule,
    BadgeModule,
    DropdownModule,
    HttpClientModule,
    VirtualScrollerModule,
    FileUploadModule,
    FontAwesomeModule,
    FormsModule,
    AgGridModule,
    InspectionPlanModule,
    SharedModule,
    SchoolInitiationPlanModule,
    InitiationPlanModule,
    NgxPaginationModule,
    ToastModule,
    AssignmentModule,
    SchoolAssignmentModule,
  ],
  providers: [
    MessageService,
    IssueService,
    LoggerService,
    ConfirmationService,
    InspectorService,
    FormDataService,
    AuthGuard,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenExpirationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
