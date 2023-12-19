import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../../../services/account.service";
import {FormBuilder, Validators} from "@angular/forms";
import {UserResponseForUserList} from "../../../../models/user-response-for-user-list";
import {RoleResponse} from "../../../../models/role-response";
import {Role} from "../../../../shared/enum/role";
import {ToastService} from "../../../../shared/toast/toast.service";
import {AuthService} from "../../../../services/auth.service";
import {RoleService} from "../../../../services/role.service";
import {ConfirmationService, ConfirmEventType} from "primeng/api";
import {getFirstAndLastName, unSub} from "../../../../shared/util/util";

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit, OnDestroy {


  user: UserResponseForUserList
  roles: RoleResponse[];
  selectedRole: RoleResponse;
  isSubmitted: boolean = false
  avatar: string;
  updateForm = this.fb.group({
    userId: [-1, Validators.required],
    isActive: [true, Validators.required],
    roleId: [-1, Validators.required]
  })
  statusOptions = [
    {label: 'Đang hoạt động', value: true},
    {label: 'Ngưng hoạt động', value: false}
  ];
  selectedStatus: any
  isLoading: boolean = false
  submitCompleted = false;
  sub: any[] = []

  breadCrumb = [
    {
      caption: 'Trang chủ',
      routerLink: '/',
    },
    {
      caption: 'Danh sách người dùng',
      routerLink: '/user/list',
    },
    {
      caption: 'Cập nhật người dùng'
    },
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private accountService: AccountService,
              private fb: FormBuilder,
              private toastService: ToastService,
              private authService: AuthService,
              private roleService: RoleService,
              private confirmationService: ConfirmationService,
              private route: Router
  ) {
  }

  ngOnInit(): void {
    const accountSub = this.accountService.findById(this.activatedRoute.snapshot.paramMap.get('id'))
      .subscribe(
        {
          next: (data) => {
            this.user = data.userDto;
            this.avatar = getFirstAndLastName(this.user.fullName);
            this.setRoles()

            console.log(this.user);

            const userRole = this.user.accountRoles?.find(value => {
              return value.role?.roleName !== Role.INSPECTOR && value.role?.roleName !== Role.CHIEF_INSPECTOR;
            });
            const userRoleValue = userRole ? userRole.role?.roleId : -1;


            this.updateForm.patchValue({
              userId: this.user.userId,
              roleId: userRoleValue,
              isActive: this.user.isActive
            })
            this.selectedRole = {
              roleName: userRole?.role?.roleName,
              roleId: userRole?.role?.roleId,
              isSchoolEmployee: userRole?.role?.isSchoolEmployee
            }

          },
          error: (error) => {
            this.toastService.showWarn('error', "Lỗi", error.error.message);
          }

        }
      )
    this.sub.push(accountSub)

  }

  getStatusSeverity(status: boolean | undefined): string {
    if (status){
      return 'success';
    }
    return 'danger';
  }

  patchRoleId() {
    this.updateForm.patchValue({
      roleId: this.selectedRole.roleId
    })
  }

  setRoles() {
    if (this.user.school?.schoolId == 1) {
      const roleSub = this.roleService.findAllDeptRoles().subscribe({
        next: (data) => {
          this.roles = data.roles;
          this.roles = this.roles.filter(role => role.roleName !== Role.ADMIN && role.roleName !== Role.CHIEF_INSPECTOR && role.roleName !== Role.INSPECTOR);
          const query = {
            "schoolId": 1,
            "roleName": Role.DIRECTOR,
            "isActive": true
          }
          this.accountService.findBySchoolIdAndRoleNameAndStatus(query).subscribe({
            next: (data) => {
              if (data.accountDtos.length > 0) {
                this.roles = this.roles.filter(role => role.roleName !== Role.DIRECTOR)
              }
            }
          })

        }
      })
      this.sub.push(roleSub)
    } else {
      const roleSub = this.roleService.findSchoolRole().subscribe({
        next: (data) => {
          this.roles = data.roles;
          const query = {
            "schoolId": this.user.school?.schoolId,
            "roleName": Role.PRINCIPAL,
            "isActive": true
          }
          this.accountService.findBySchoolIdAndRoleNameAndStatus(query).subscribe({
            next: (data) => {
              if (data.accountDtos.length > 0) {
                this.roles = this.roles.filter(role => role.roleName !== Role.PRINCIPAL)
              }
            }
          })
        }
      })
      this.sub.push(roleSub)
    }

  }

  onSubmit() {
    this.isLoading = true;
    console.log(this.updateForm.value);
    if (!this.updateForm.invalid) {
   const updateUserSub=   this.accountService.updateUser(this.updateForm.value).subscribe({
        next: (data) => {
          this.submitCompleted = true;
          setTimeout(() => {
            this.route.navigate(['user/' + data.accountDto.accountId])
          }, 1500)
          console.log(data);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastService.showWarn('error', "Lỗi", error.error.message);

        }
      })
      this.sub.push(updateUserSub);
    }
  }

  confirm() {
    this.confirmationService.confirm({
      message: 'Bạn có xác nhận muốn cập nhật người dùng này không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: () => {
        this.onSubmit()

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toastService.showWarn('error', 'Hủy bỏ', 'Bạn đã hủy việc cập nhật người dùng');
            break;
          case ConfirmEventType.CANCEL:
            this.toastService.showWarn('error', 'Hủy bỏ', 'Bạn đã hủy việc cập nhật người dùng');
            break;
        }
      }, key: 'updateUserConfirm'
    });
  }

  isRoleUpdatable() {
    console.log("is role" + this.user.accountRoles?.some(value => value.role?.roleName === Role.DIRECTOR
      || value.role?.roleName === Role.PRINCIPAL));
    if ((this.user.accountRoles?.some(value => value.role?.roleName === Role.DIRECTOR
      || value.role?.roleName === Role.PRINCIPAL))) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    unSub(this.sub)
  }


}
