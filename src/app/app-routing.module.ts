import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginFormComponent} from "./features/login/login-form/login-form.component";
import {LoginBaseComponent} from "./features/login/login-base/login-base.component";
import {ForgotPasswordComponent} from "./features/login/forgot-password/forgot-password.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  {
    path: '',
    component: LoginBaseComponent,
    children: [
      {
        path: 'login',
        component: LoginFormComponent
      },
      {
        path: 'forgot_password',
        component: ForgotPasswordComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
