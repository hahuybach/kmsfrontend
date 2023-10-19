import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Moment} from 'moment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginFormComponent} from './features/login/login-form/login-form.component';
import {MainComponent} from './main/main/main.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {SearchbarComponent} from './components/searchbar/searchbar.component';
import {IssueListComponent} from './features/post-login/issue-list/issue-list.component';
import {DashboardComponent} from './features/post-login/dashboard/dashboard.component';
import {ToastModule} from 'primeng/toast';
import {MenuModule} from 'primeng/menu';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {BadgeModule} from 'primeng/badge';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DropdownModule} from 'primeng/dropdown'
import {IssueService} from './services/issue.service';
import {LoggerService} from './services/LoggerService';
import {IssueDetailComponent} from './features/post-login/issue-list/issue-detail/issue-detail.component';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {CreateIssueComponent} from './features/post-login/issue-list/create-issue/create-issue.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FileUploadModule} from 'primeng/fileupload';
import {ForgotPasswordComponent} from './features/login/forgot-password/forgot-password.component';
import {LoginBaseComponent} from './features/login/login-base/login-base.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {PagenotfoundComponent} from './components/pagenotfound/pagenotfound.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthInterceptor} from "./auth.interceptor";

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
    PagenotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenuModule,
    ToastModule,
    BrowserAnimationsModule,
    ButtonModule,
    BadgeModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    HttpClientModule,
    VirtualScrollerModule,
    InputTextareaModule,
    FileUploadModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  providers: [
    MessageService,
    IssueService,
    LoggerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
     ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
