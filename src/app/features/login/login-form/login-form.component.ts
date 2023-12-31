import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {ToastService} from "../../../shared/toast/toast.service";
import {Role} from "../../../shared/enum/role";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  signInForm: FormGroup;

  loading: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  login() {
    this.loading = true

    const val = this.signInForm.value;
    if (val.email && val.password) {
      this.auth.login(val.email, val.password).subscribe({
        next: (response) => {
          this.auth.setJwtInCookie(response.token);
          this.auth.setTokenTimeOut();
          if (this.auth.getRoleFromJwt()){
            for (const arg of this.auth.getRoleFromJwt()) {
              if (arg.authority === Role.ADMIN){
            this.isAdmin = true

              }
            }
          }
          if (this.isAdmin){
            this.router.navigateByUrl('/school/list');

          }else {
            setTimeout(() => {
              this.router.navigateByUrl('/dashboard');
              this.loading = false;
            } ,1000);
          }

        },
        error: (err) => {
          this.toastService.showError('center', 'Thông báo', err.error.message);
          this.loading = false;
        },
      });
    }
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: '',
      password: '',
    });
  }
}
