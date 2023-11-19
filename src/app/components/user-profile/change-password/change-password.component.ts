import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {NoWhitespaceValidator} from "../../../shared/validators/no-white-space.validator";
import {passwordStrong} from "../../../shared/validators/password-strong";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  @Input()  visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  form = this.fb.group({
    password: ['', NoWhitespaceValidator()],
    changePassword : ['', [Validators.required, passwordStrong.bind(this)]],
    confirmPassword: ['', this.passwordMatchValidator.bind(this)]
  })
  constructor(private fb: FormBuilder) {
  }
  resetVisible(){
    this.visibleChange.emit(this.visible);

  }
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const changePassword = control.get('changePassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (changePassword !== confirmPassword) {
      return { 'passwordMismatch': true };
    }

    return null;
  }


}
