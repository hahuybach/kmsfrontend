import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER, TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { UpdateIssueComponent } from './features/post-login/issue/update-issue/update-issue.component';
import { InspectorService } from './services/inspector.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './features/login/login-form/login-form.component';
import { MainComponent } from './main/main/main.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { IssueListComponent } from './features/post-login/issue/issue-list/issue-list.component';
import { DashboardComponent } from './features/post-login/dashboard/dashboard.component';
import { MenuModule } from 'primeng/menu';
import { AgGridModule } from 'ag-grid-angular';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { IssueService } from './services/issue.service';
import { LoggerService } from './services/LoggerService';
import { IssueDetailComponent } from './features/post-login/issue/issue-detail/issue-detail.component';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { CreateIssueComponent } from './features/post-login/issue/create-issue/create-issue.component';
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
import { SortByIdPipe } from './shared/pipes/sortByDocumentTypeIdPipe.pipe';
import { InspectionPlanModule } from './features/post-login/inspection-plan/inspection-plan/inspection-plan.module';
import { SharedModule } from './shared/shared.module';
import { DatePipe } from '@angular/common';
import { SchoolInitiationPlanModule } from './features/post-login/school-initiation-plan/school-initiation-plan.module';
import { TokenExpirationInterceptor } from './shared/interceptor/token_expiration_inceptor/token-expiration.interceptor';
import { GuidanceDocumentListComponent } from './features/post-login/guidance-document/guidance-document-list/guidance-document-list.component';
import { GuidanceDocumentDetailComponent } from './features/post-login/guidance-document/guidance-document-detail/guidance-document-detail.component';
import { GuidanceDocumentFilesComponent } from './features/post-login/guidance-document/guidance-document-detail/guidance-document-files/guidance-document-files.component';
import { InitiationPlanModule } from './features/post-login/school-side/initiation-plan/initiation-plan.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastModule } from 'primeng/toast';
import { GuidanceDocumentCreateComponent } from './features/post-login/guidance-document/guidance-document-create/guidance-document-create.component';
import { AssignmentModule } from './features/post-login/assignment/assignment.module';
import { SchoolAssignmentModule } from './features/post-login/school-side/assignment/school-assignment.module';
import { UserListComponent } from './features/post-login/user/user-list/user-list.component';
import { UserDetailComponent } from './features/post-login/user/user-detail/user-detail.component';
import { UserCreateComponent } from './features/post-login/user/user-create/user-create.component';

import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { StompService } from './features/post-login/push-notification/stomp.service';
import { UserUpdateComponent } from './features/post-login/user/user-update/user-update.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChangePasswordComponent } from './components/user-profile/change-password/change-password.component';
import { NotificationListAllComponent } from './components/notification-list/notification-list-all/notification-list-all.component';
import { NotificationListUnseenComponent } from './components/notification-list/notification-list-unseen/notification-list-unseen.component';
import { InspectionModule } from './features/post-login/inspection/inspection.module';
import { SchoolListModule } from './features/post-login/school/school-list.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { IssueBaseComponent } from './features/post-login/issue/issue-base/issue-base.component';
import { InspectionPlanBaseComponent } from './features/post-login/inspection-plan/inspection-plan-base/inspection-plan-base.component';
import { GuidanceDocumentBaseComponent } from './features/post-login/guidance-document/guidance-document-base/guidance-document-base.component';
import { UserBaseComponent } from './features/post-login/user/user-base/user-base.component';
import { TUI_LANGUAGE, TUI_VIETNAMESE_LANGUAGE } from '@taiga-ui/i18n';
import { of } from 'rxjs';
import {TuiUnfinishedValidatorModule} from "@taiga-ui/kit";
import { IssueInspectorPopupComponent } from './features/post-login/issue/component/issue-inspector-popup/issue-inspector-popup.component';
import { IssueInspectorListComponent } from './features/post-login/issue/component/issue-inspector-list/issue-inspector-list.component';
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
    SortByIdPipe,
    GuidanceDocumentListComponent,
    GuidanceDocumentDetailComponent,
    GuidanceDocumentFilesComponent,
    GuidanceDocumentCreateComponent,
    UserListComponent,
    UserDetailComponent,
    UserCreateComponent,
    NotificationListComponent,
    UserUpdateComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    NotificationListAllComponent,
    NotificationListUnseenComponent,
    IssueBaseComponent,
    InspectionPlanBaseComponent,
    GuidanceDocumentBaseComponent,
    UserBaseComponent,
    IssueInspectorPopupComponent,
    IssueInspectorListComponent,
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
    InspectionModule,
    SchoolListModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiTextfieldControllerModule,
    TuiUnfinishedValidatorModule,
  ],
  providers: [
    MessageService,
    IssueService,
    LoggerService,
    ConfirmationService,
    InspectorService,
    FormDataService,
    AuthGuard,
    StompService,
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
    provideAnimations(),
    {provide: MAT_DATE_LOCALE, useValue: 'vi-VN'},
    {provide: TUI_LANGUAGE, useValue: of(TUI_VIETNAMESE_LANGUAGE)},
    {provide: TUI_SANITIZER, useClass: NgDompurifySanitizer},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
