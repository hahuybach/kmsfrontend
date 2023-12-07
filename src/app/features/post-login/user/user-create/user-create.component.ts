import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../../../services/account.service";
import {Route, Router} from "@angular/router";
import {RoleService} from "../../../../services/role.service";
import {RoleResponse} from "../../../../models/role-response";
import {AuthService} from "../../../../services/auth.service";
import {ToastService} from "../../../../shared/toast/toast.service";
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {NoWhitespaceValidator} from "../../../../shared/validators/no-white-space.validator";
import {ConfirmationService, ConfirmEventType} from "primeng/api";
import {SchoolResponse} from "../../../../models/school-response";
import {Role} from "../../../../shared/enum/role";
import {SchoolService} from "../../../../services/school.service";


@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  roles: RoleResponse[];
  selectedRole: any;
  genders: any[] = [{label: 'Nam', value: 'MALE'},
    {label: 'Nữ', value: 'FEMALE'}]

  createUserForm = this.fb.group({
    email: ['', [Validators.email, Validators.required, Validators.maxLength(254)], [this.validateEmailUnique.bind(this)]],
    roleId: [-1, [Validators.required, Validators.min(1)]],
    fullName: ['', [NoWhitespaceValidator(), Validators.required, Validators.maxLength(254)]],
    gender: ['MALE'],
    phoneNumber: [null, [Validators.pattern("^[0-9]{10}$")]],
    dob: [null, this.validateDateNotGreaterThanToday.bind(this)],
    isActive: [true],
    schoolId: [-1, [Validators.required, Validators.min(1)]]

  })
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  schools: SchoolResponse[]
  selectedSchool: any
  submitCompleted = false;

  constructor(private accountService: AccountService,
              private route: Router,
              private auth: AuthService,
              private roleService: RoleService,
              private toast: ToastService,
              private fb: FormBuilder,
              private confirmationService: ConfirmationService,
              private schoolService: SchoolService) {
  }

  ngOnInit(): void {
    for (const argument of this.auth.getRoleFromJwt()) {
      if (argument.authority === Role.DIRECTOR) {
        this.roleService.findDeptRoles().subscribe({
          next: (data) => {
            this.roles = data.roles;
            this.createUserForm.patchValue({
              schoolId: this.auth.getSchoolFromJwt().schoolId
            })

          },
          error: (err) => {
            this.toast.showWarn('error', "Lỗi", err.error.message)
            console.log(err);
          }
        })
      }
      if (argument.authority === Role.PRINCIPAL) {
        this.roleService.findSchoolRole().subscribe(
          {
            next: (data) => {
              this.roles = data.roles;
              this.roles = this.roles.filter(role => role.roleName !== "Hiệu Trưởng");
              this.createUserForm.patchValue({
                schoolId: this.auth.getSchoolFromJwt().schoolId
              })
            },
            error: (err) => {
              this.toast.showWarn('error', "Lỗi", err.error.message)
              console.log(err);
            }
          }
        )
      }

      if (argument.authority === Role.ADMIN) {
        this.schoolService.findAll().subscribe({
          next: (data) => {
            this.schools = data;
            this.selectedSchool = this.schools.at(0);

            this.createUserForm.patchValue({
              schoolId: this.selectedSchool.schoolId
            })
            this.roleService.findAllDeptRoles().subscribe({
              next: (data) => {
                this.roles = data.roles;
                this.roles = this.roles.filter(role => role.roleName !== Role.ADMIN && role.roleName !== Role.CHIEF_INSPECTOR && role.roleName !== Role.INSPECTOR);
                if (this.selectedSchool.schoolId == 1) {
                  this.setRole(this.selectedSchool.schoolId, Role.DIRECTOR, true);
                } else {
                  this.setRole(this.selectedSchool.schoolId, Role.PRINCIPAL, true);

                }
              }
            })
          }
        })
      }
    }

  }

  setRole(schoolId: number, roleName: string, isActive: boolean) {
    const data = {
      "schoolId": schoolId,
      "roleName": roleName,
      "isActive": isActive
    }
    this.accountService.findBySchoolIdAndRoleNameAndStatus(data).subscribe({
      next: (data) => {
        console.log(data);
        if (data.accountDtos.length > 0) {
          // PGD thi remove truong phong neu co 1 truong phong active
          if (schoolId == 1) {
            this.roles = this.roles.filter(role => role.roleName !== Role.DIRECTOR)
          } else {
            this.roles = this.roles.filter(role => role.roleName !== Role.PRINCIPAL)
          }
        }
      }
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    console.log(this.createUserForm.get('fullName'));
    if (!this.createUserForm.invalid) {
      this.isLoading = true;
      console.log("is valid")
      this.accountService.saveUser(this.createUserForm).subscribe({
        next: (data) => {
          this.submitCompleted = true;
          setTimeout(() => {
            this.route.navigate(['user/' + data.userDto.userId])
          }, 1500)
        },
        error: (err) => {
          this.isLoading = false;
          this.toast.showWarn('error', "Lỗi", err.error.message)
          console.log(err);
        }
      })
    }
    console.log(this.createUserForm.value);
  }

  patchRoleId() {
    console.log(this.selectedRole);
    this.createUserForm.patchValue({
      roleId: this.selectedRole?.roleId
    })
  }

  isBlank(field: string): boolean | undefined {
    return (
      this.createUserForm.get(field)?.hasError('required') &&
      ((this.createUserForm.get(field)?.dirty ?? false) ||
        (this.createUserForm.get(field)?.touched ?? false) || this.isSubmitted)
    );
  }

  isError(field: string, errorCode: string): boolean | undefined {
    return (
      this.createUserForm.get(field)?.hasError(errorCode) &&
      ((this.createUserForm.get(field)?.dirty ?? false) ||
        (this.createUserForm.get(field)?.touched ?? false))
    );
  }

  validateDateNotGreaterThanToday(control: AbstractControl): ValidationErrors | null {
    const selectedDate = control.value;
    const today = new Date();

    if (selectedDate && new Date(selectedDate) > today) {
      return {'invalidDate': true};
    }

    return null;
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

  confirm() {
    if (this.createUserForm.invalid){
      this.isSubmitted = true;
      return
    }
    if (!this.createUserForm.touched){
      return;
    }
    this.confirmationService.confirm({
      message: 'Bạn có xác nhận muốn tạo người dùng này không?',
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
            this.toast.showError('error', 'Hủy bỏ', 'Bạn đã hủy việc tạo người dùng');
            break;
          case ConfirmEventType.CANCEL:
            this.toast.showWarn('error', 'Hủy bỏ', 'Bạn đã hủy việc tạo người dùng');
            break;
        }
      },key: 'popUpConfirm'
    });
  }

  patchSchoolId() {
    this.createUserForm.patchValue({
      schoolId: this.selectedSchool?.schoolId
    })
    this.changeRole();
  }

  changeRole() {
    // school role
    if (this.selectedSchool.schoolId != 1) {
      this.roleService.findSchoolRole().subscribe({
        next: (data) => {
          this.roles = data.roles;
          this.setRole(this.selectedSchool.schoolId, Role.PRINCIPAL,true)

        }
      })
    } else {
      this.roleService.findAllDeptRoles().subscribe({
        next: (data) => {
          this.roles = data.roles;
          this.roles = this.roles.filter(role => role.roleName !== Role.ADMIN && role.roleName !== Role.CHIEF_INSPECTOR && role.roleName !== Role.INSPECTOR);
          this.setRole(this.selectedSchool.schoolId, Role.DIRECTOR,true)
        }
      })
    }

  }
}
