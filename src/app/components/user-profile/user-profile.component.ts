import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AccountService} from "../../services/account.service";
import {FormBuilder, Validators} from "@angular/forms";
import {NoWhitespaceValidator} from "../../shared/validators/no-white-space.validator";
import {validateDateNotGreaterThanToday} from "../../shared/validators/date-not-greater-than-today";
import {UserResponseForUserList} from "../../models/user-response-for-user-list";
import {ToastService} from "../../shared/toast/toast.service";
import {ConfirmationService, ConfirmEventType} from "primeng/api";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
 @Input()  visible = false;
 @Output() visibleChange = new EventEmitter<boolean>();
 isUpdate = false
 currentUser : UserResponseForUserList
  form = this.fb.group({
    fullName: ['', NoWhitespaceValidator()],
    dob:[null as unknown as Date, validateDateNotGreaterThanToday.bind(this)],
    gender: ['', Validators.required],
    phoneNumber: ['', [Validators.pattern("^[0-9]{10}$"), Validators.required]]
  })
  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private toastService: ToastService,
              private confirmationService: ConfirmationService
              ) {
  }
  genders: any[] = [{label: 'Nam', value: 'MALE'},
    {label: 'Nữ', value: 'FEMALE'}]
  isSubmitted = false
  isVisible: any;
  isLoading = false;
  submitCompleted = false;
  ngOnInit(): void {
    this.accountService.getCurrentUser().subscribe({
      next: (data) =>{
        this.currentUser = data.userDto;
        this.form.patchValue({
          fullName: this.currentUser.fullName,
          dob: this.currentUser?.dob,
          gender: this.currentUser.gender,
          phoneNumber: this.currentUser.phoneNumber,
        })
      }

    })
    console.log(this.form.value);
  }

  resetVisible(){
   this.visibleChange.emit(this.visible);
   this.isUpdate = false;
    this.form.patchValue({
      fullName: this.currentUser.fullName,
      dob: this.currentUser?.dob,
      gender: this.currentUser.gender,
      phoneNumber: this.currentUser.phoneNumber,
    })
  }

  onUpdate() {
    this.isUpdate = !this.isUpdate;
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
    if (!this.form.invalid){
      this.isLoading = true
      this.accountService.updateUserDetail(this.form.value).subscribe({
        next: (data) =>{
          this.isUpdate = false;
          this.submitCompleted = true;
          setTimeout(() => {
            this.ngOnInit();
          }, 1500)
          setTimeout(() => {
            this.isLoading = false
          }, 1500)
        }, error: (error) => {
          this.isLoading = false;
          this.submitCompleted = false;
          this.toastService.showWarn("user-profile", "Lỗi", error.error.message);
        }

      })
    }
  }
  confirm() {
    if (!this.form.touched){
      return;
    }
    if (this.form.invalid ){
      this.isSubmitted = true;
      return
    }
    this.confirmationService.confirm({
      message: 'Bạn có xác nhận việc thay đổi này không?',
      header: 'Xác nhân',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: () => {
        this.onSubmit()

      },key: "user-profile-confirm",
    });
  }

  onClickChangePassword() {
    this.isVisible = !this.isVisible;
  }
}
