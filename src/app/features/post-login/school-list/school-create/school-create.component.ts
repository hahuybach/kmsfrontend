import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {map, Observable} from "rxjs";
import {SchoolService} from "../../../../services/school.service";
import {AccountService} from "../../../../services/account.service";
import {ToastService} from "../../../../shared/toast/toast.service";
import {Router} from "@angular/router";
import {NoWhitespaceValidator} from "../../../../shared/validators/no-white-space.validator";
import {validateDateNotGreaterThanToday} from "../../../../shared/validators/date-not-greater-than-today";
import {ConfirmationService, ConfirmEventType} from "primeng/api";

@Component({
  selector: 'app-school-create',
  templateUrl: './school-create.component.html',
  styleUrls: ['./school-create.component.scss']
})
export class SchoolCreateComponent implements OnInit {
  saveSchoolForm: FormGroup;
  isSubmitted: boolean
  isLoading: boolean = false;
  genders: any[] = [{label: 'Nam', value: 'MALE'},
    {label: 'Nữ', value: 'FEMALE'}]
  submitCompleted = false;


  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private schoolService: SchoolService,
              private toastService: ToastService,
              private router: Router,
              private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    this.saveSchoolForm = this.formBuilder.group({
      schoolName: ['', Validators.required, [this.validateSchoolNameUnique.bind(this)]],
      exactAddress: ['', Validators.required],
      isActive: [true, Validators.required],
      email: ['', [Validators.required, Validators.email], [this.validateEmailUnique.bind(this)]],
      fullName: ['', [NoWhitespaceValidator(), Validators.required]],
      gender: ['MALE'],
      phoneNumber: [null, [Validators.pattern("^[0-9]{10}$")]],
      dob: [null, validateDateNotGreaterThanToday.bind(this)],
    });

  }

  onSubmit() {
    this.isSubmitted = true;

    const saveSchoolRequest = {
      school: {
        schoolName: this.saveSchoolForm.value.schoolName,
        exactAddress: this.saveSchoolForm.value.exactAddress,
        isActive: this.saveSchoolForm.value.isActive
      },
      account: {
        email: this.saveSchoolForm.value.email,
        user: {
          fullName: this.saveSchoolForm.value.fullName,
          dob: this.saveSchoolForm.value.dob,
          gender: this.saveSchoolForm.value.gender,
          phoneNumber: this.saveSchoolForm.value.phoneNumber
        }
      }
    };
    if (!this.saveSchoolForm.invalid) {
      this.isLoading = true;
      this.schoolService.saveSchool(saveSchoolRequest)
        .subscribe({
          next: (result) => {
            this.submitCompleted = true;
            setTimeout(() => {
              this.router.navigate(['school/' + result.school.schoolId])
            }, 1500)
          },
          error: (error) => {
            this.isLoading = false;
            this.toastService.showWarn('error', "Lỗi", error.error.message)
            console.log(error);
          }
        })
    }

    console.log(saveSchoolRequest);
  }


  isBlank(field: string): boolean | undefined {
    return (
      this.saveSchoolForm.get(field)?.hasError('required') &&
      ((this.saveSchoolForm.get(field)?.dirty ?? false) ||
        (this.saveSchoolForm.get(field)?.touched ?? false) || this.isSubmitted)
    );
  }
  checkError(field: string, errorCode: string): boolean | undefined {
    return (
      this.saveSchoolForm.get(field)?.hasError(errorCode) &&
      ((this.saveSchoolForm.get(field)?.dirty ?? false) ||
        (this.saveSchoolForm.get(field)?.touched ?? false) || this.isSubmitted)
    );
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

  validateSchoolNameUnique(control: AbstractControl): Promise<ValidationErrors | null> {

    const schoolName = control.value;
    return new Promise<ValidationErrors | null>((resolve, reject) => {
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
  confirm() {
    this.confirmationService.confirm({
      message: 'Bạn có xác nhận muốn tạo trường này không?',
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
            this.toastService.showError('error', 'Hủy bỏ', 'Bạn đã hủy việc tạo trường');
            break;
          case ConfirmEventType.CANCEL:
            this.toastService.showWarn('error', 'Hủy bỏ', 'Bạn đã hủy việc tạo trường');
            break;
        }
      },key: 'updateConfirm'
    });
  }

}
