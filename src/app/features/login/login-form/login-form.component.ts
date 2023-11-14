import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {ToastService} from "../../../shared/toast/toast.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  login() {
    const val = this.signInForm.value;
    console.log(val);
    if (val.email && val.password) {
      this.auth.login(val.email, val.password).subscribe({
        next: (response) => {

          this.auth.setJwtInCookie(response.token);
          this.auth.setTokenTimeOut();
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {

          console.log('Error: ' + err);

          console.log(err.error.message);
          this.toastService.showError('center', 'Thông báo', err.error.message);
        },
      });
    }
  }

  // login(){
  //   this.auth.logout()
  // }
  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: '',
      password: '',
    });
  }
}
