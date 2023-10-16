import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import * as moment  from 'moment';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
  }

  login() {
    const val = this.signInForm.value;
    console.log(val);
    if (val.username && val.password) {
      this.auth.login(val.username, val.password)
        .subscribe(
          res => {
            const d = JSON.parse(res);
            console.log("Đăng nhập thành công ", res);
            console.log(d.token);
            this.router.navigateByUrl('/dashboard');
          },
          error => {
            console.log('oops', error);
            this.router.navigateByUrl('/login');
          }
        );
    }
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group(
      {
        username: '',
        password: ''
      });
  }

}
