import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import * as moment from 'moment';

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
    if (val.email && val.password) {
      this.auth.login(val.email, val.password)
        .subscribe({
          next: (response) => {
            const data = JSON.parse(response);
            this.setJwtInCookie(data.token);
            this.router.navigateByUrl("/dashboard");
          },
          error: (err) => {
            console.log("Error: " +  err);
            this.router.navigateByUrl("/login");
          }
        });
    }
  }

  setJwtInCookie(jwt: string){
    document.cookie = `jwtToken=${jwt}`;
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group(
      {
        email: '',
        password: ''
      });
  }

}
