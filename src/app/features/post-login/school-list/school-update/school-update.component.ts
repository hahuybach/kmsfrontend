import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SchoolService} from "../../../../services/school.service";
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {SchoolResponse} from "../../../../models/school-response";
import {switchMap} from "rxjs";
import {AccountResponse} from "../../../../models/account-response";
import {AccountService} from "../../../../services/account.service";
import {ToastService} from "../../../../shared/toast/toast.service";
import {NoWhitespaceValidator} from "../../../../shared/validators/no-white-space.validator";
import {validateDateNotGreaterThanToday} from "../../../../shared/validators/date-not-greater-than-today";
import {ConfirmationService, ConfirmEventType} from "primeng/api";

@Component({
  selector: 'app-school-update',
  templateUrl: './school-update.component.html',
  styleUrls: ['./school-update.component.scss']
})
export class SchoolUpdateComponent implements OnInit {
  updateForm = this.fb.group({
    schoolId: [-1, Validators.required],
    schoolName: ['', [NoWhitespaceValidator()], [this.validateSchoolNameUnique.bind(this)]],
    address: ['', NoWhitespaceValidator()],
    isActive: [false, Validators.required],
    principalEmail: ['', [Validators.email], [this.validateEmailUnique.bind(this)]],
    fullName: ['', [NoWhitespaceValidator(), Validators.required]],
    gender: ['MALE'],
    phoneNumber: [null, [Validators.pattern("^[0-9]{10}$")]],
    dob: [null, validateDateNotGreaterThanToday.bind(this)],
  })
  school: SchoolResponse;
  principal: AccountResponse
  isUpdatePrincipalEmail: boolean = false;
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  genders: any[] = [{label: 'Nam', value: 'MALE'},
    {label: 'Nữ', value: 'FEMALE'}]
  submitCompleted = false;


  constructor(private router: Router,
              private schoolService: SchoolService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private accountService: AccountService,
              private toastService: ToastService,
              private confirmationService: ConfirmationService) {


  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap((param) => {
        return this.schoolService.findSchoolById(param['id'])
      })
    ).subscribe((data) => {
      this.school = data;
      this.principal = data.principal;
      this.updateForm.patchValue({
        schoolId: this.school.schoolId,
        schoolName: this.school.schoolName,
        address: this.school.exactAddress,
        isActive: this.school.isActive,
        principalEmail: this.principal?.email

      })
      console.log(data);
    })

  }


  onSubmit() {
    this.isSubmitted = true;

    console.log(this.updateForm.value);
    if ((!this.updateForm.get('schoolName')?.invalid && !this.updateForm.get('address')?.invalid && this.isUpdatePrincipalEmail == false)
    || (this.isUpdatePrincipalEmail == true && !this.updateForm.invalid)
    ) {

      this.isLoading = true;
      this.schoolService.updateSchool(this.updateForm.value).subscribe(
        {
          next: (data) => {
            this.submitCompleted = true;
            setTimeout(() => {
              this.router.navigate(['school/' + this.school.schoolId])
            }, 1500)
          },
          error: (err) => {
            this.isLoading = false;
            this.toastService.showWarn('error', "Lỗi", err.error.message)
            console.log(err);
          }
        }
      )
    }
  }


  onClickNotUpdatePrincipalEmail() {
    if (this.isUpdatePrincipalEmail) {
      this.isUpdatePrincipalEmail = false;
      this.updateForm.patchValue({
        principalEmail: this.principal?.email
      })

    } else {
      this.isUpdatePrincipalEmail = true;

    }

  }

  isBlank(field: string): boolean | undefined {
    return (
      this.updateForm.get(field)?.hasError('required') &&
      ((this.updateForm.get(field)?.dirty ?? false) ||
        (this.updateForm.get(field)?.touched ?? false) || this.isSubmitted)
    );
  }

  check(field: string, errorCode: string): boolean | undefined {
    return (
      this.updateForm.get(field)?.hasError(errorCode) &&
      ((this.updateForm.get(field)?.dirty ?? false) ||
        (this.updateForm.get(field)?.touched ?? false) || this.isSubmitted)
    );
  }

  validateSchoolNameUnique(control: AbstractControl): Promise<ValidationErrors | null> {

    const schoolName = control.value;

    return new Promise<ValidationErrors | null>((resolve, reject) => {
      if (this.school.schoolName == schoolName) {
        resolve(null);
      }
      this.schoolService.isSchoolNameUnique(schoolName).subscribe({
        next: (result) => {
          console.log(result);
          if (result.isUnique) {
            setTimeout(() => {
              resolve(null);

            }, 1000)
          } else {
            setTimeout(() => {
              resolve({'notUnique': true});

            }, 1000)
          }
        },
        error: (error) => {
          console.error(error);
          // Handle the error if necessary
          reject(error);
        },
        complete: () => {
        },
      });
    });
  }

  validateEmailUnique(control: AbstractControl): Promise<ValidationErrors | null> {

    const email = control.value;
    return new Promise<ValidationErrors | null>((resolve, reject) => {

      this.accountService.isUnique(email).subscribe({
        next: (result) => {
          console.log(result);
          if (result.isUnique) {
            setTimeout(() => {
              resolve(null);

            }, 1000)
          } else {
            setTimeout(() => {
              resolve({'notUnique': true});

            }, 1000)
          }
        },
        error: (error) => {
          console.error(error);
          // Handle the error if necessary
          reject(error);
        },
        complete: () => {
        },
      });
    });
  }

  onBack() {
    this.router.navigate(['school/' + this.school.schoolId])
  }
  confirm() {
    this.confirmationService.confirm({
      message: 'Bạn có xác nhận hành động này không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel:'Không',
      accept: () => {
        this.onSubmit()

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toastService.showError('error', 'Hủy bỏ', 'Bạn đã hủy việc cập nhật');
            break;
          case ConfirmEventType.CANCEL:
            this.toastService.showWarn('error', 'Hủy bỏ', 'Bạn đã hủy việc cập nhật');
            break;
        }
      },key: 'updateSchoolConfirm'
    });
  }


}
