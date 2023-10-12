import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './features/login/login-form/login-form.component';
import { MainComponent } from './main/main/main.component';
import { ForgotPasswordComponent } from './features/login/forgot-password/forgot-password.component';
import { LoginBaseComponent } from './features/login/login-base/login-base.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    MainComponent,
    ForgotPasswordComponent,
    LoginBaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
