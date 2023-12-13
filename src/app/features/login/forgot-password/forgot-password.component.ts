import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {ToastService} from "../../../shared/toast/toast.service";
import {NoWhitespaceValidator} from "../../../shared/validators/no-white-space.validator";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  isSubmitted = false
  isConfirm = false;
  isLoading= false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  })

  confirmForm = this.fb.group({
    email : ['', Validators.required],
    code: ['', NoWhitespaceValidator()]
  })
  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private toastService: ToastService,
              private router: Router
              ) {
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.form.invalid){
      this.isLoading = true;
      this.auth.sendResetPasswordToken(this.form.value).subscribe({
        next: (data) => {
          this.toastService.showSuccess('reset-password', "Thông báo", data.message)
          this.isLoading = false;
          this.isConfirm = true;
          this.confirmForm.patchValue({
            email: this.form.get('email')?.value,
          })
        },
        error : (error) => {
          this.isLoading = false;
          this.toastService.showWarn('reset-password', "Lỗi", error.error.message)
        }
      })
    }

  }
  isBlank(field: string): boolean | undefined {
    return (
      this.form.get(field)?.hasError('required') &&
      ((this.form.get(field)?.dirty ?? false) ||
        (this.form.get(field)?.touched ?? false) || this.isSubmitted)
    );
  }

  isError(field: string, errorCode: string, form: FormGroup): boolean | undefined {
    return (
     form.get(field)?.hasError(errorCode) &&
      ((form.get(field)?.dirty ?? false) ||
        (form.get(field)?.touched ?? false))
    );
  }
  onSubmitConfirm(){
    if (!this.confirmForm.invalid){
      this.isLoading = true;
      this.auth.resetPassword(this.confirmForm.value).subscribe({
        next: (data) =>{
          this.isLoading = false;
          this.toastService.showSuccess("reset-password","Thành công", data.message);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastService.showError("reset-password","Lỗi", error.error.message);

        }
      })
    }
  }

  toLogin() {
    this.router.navigate(['login'])
  }
}
