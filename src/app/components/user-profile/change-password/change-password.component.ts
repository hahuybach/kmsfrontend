import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {NoWhitespaceValidator} from "../../../shared/validators/no-white-space.validator";
import {passwordStrong} from "../../../shared/validators/password-strong";
import {ConfirmationService, ConfirmEventType} from "primeng/api";
import {ToastService} from "../../../shared/toast/toast.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  @Input()  visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  isSubmitted = false;
  form = this.fb.group({
    password: ['', [NoWhitespaceValidator(), Validators.required]],
    changePassword : ['', [Validators.required, passwordStrong.bind(this)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator })
  constructor(private fb: FormBuilder,
              private confirmationService: ConfirmationService,
              private toast: ToastService
              ) {
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

  isBlank(field: string): boolean | undefined {
    return (
      this.form.get(field)?.hasError('required') &&
      ((this.form.get(field)?.dirty ?? false) ||
        (this.form.get(field)?.touched ?? false) || this.isSubmitted)
    );
  }

  isError(field: string, errorCode: string): boolean | undefined {
    return (
      this.form.get(field)?.hasError(errorCode) &&
      ((this.form.get(field)?.dirty ?? false) ||
        (this.form.get(field)?.touched ?? false))
    );
  }


  onSubmit() {
    this.isSubmitted = true;
  }
  confirm() {
    this.confirmationService.confirm({
      message: 'Bạn có xác nhận việc thay đổi này không?',
      header: 'Xác nhân',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: () => {
        this.onSubmit()

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toast.showError('error', 'Hủy bỏ', 'Bạn đã hủy việc thay đổi');
            break;
          case ConfirmEventType.CANCEL:
            this.toast.showWarn('error', 'Hủy bỏ', 'Bạn đã hủy việc thay đổi');
            break;
        }
      }
    });
  }

}