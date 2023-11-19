import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AccountService} from "../../services/account.service";
import {FormBuilder, Validators} from "@angular/forms";
import {NoWhitespaceValidator} from "../../shared/validators/no-white-space.validator";
import {validateDateNotGreaterThanToday} from "../../shared/validators/date-not-greater-than-today";
import {UserResponseForUserList} from "../../models/user-response-for-user-list";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
 @Input()  visible = false;
 isUpdate = false
 currentUser : UserResponseForUserList
  form = this.fb.group({
    fullName: ['', NoWhitespaceValidator()],
    dob:[null as unknown as Date, validateDateNotGreaterThanToday.bind(this)],
    gender: ['', Validators.required],
    phoneNumber: ['', [Validators.pattern("^[0-9]{10}$"), Validators.required]]
  })
  constructor(private fb: FormBuilder,
              private accountService: AccountService) {
  }
  genders: any[] = [{label: 'Nam', value: 'MALE'},
    {label: 'Nữ', value: 'FEMALE'}]
  isSubmitted = false
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


  onUpdate() {
    this.isUpdate = true;
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
}
