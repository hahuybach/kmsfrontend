import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../../../services/account.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserResponseForUserList} from "../../../../models/user-response-for-user-list";
import {Role} from "../../../../shared/enum/role";
import {AuthService} from "../../../../services/auth.service";
import {getFirstAndLastName} from "../../../../shared/util/util";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: UserResponseForUserList;
  isPrincipal: boolean;
  isAdmin: boolean;
  isDirector: boolean;
  avatar: string;
  isActives: any[] = [{label: 'Đang hoạt động', value: 'true'},
    {label: 'Ngưng hoạt động', value: 'false'}]

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
      caption: 'Chi tiết người dùng'
    },
  ];

  constructor(private accountService: AccountService,
              private router: Router,
              private activateRouter: ActivatedRoute,
              private auth: AuthService) {
  }

  getStatusValue(status: undefined | boolean): string {
    if (status){
      return 'Đang hoạt động';
    }
    return 'Ngưng hoạt động';
  }

  getStatusSeverity(status: boolean | undefined): string {
    if (status){
      return 'success';
    }
    return 'danger';
  }

  ngOnInit(): void {
    this.setAuthority();
    this.accountService.findById(this.activateRouter.snapshot.paramMap.get('id'))
      .subscribe(
        {
          next: (data) => {
            this.user = data.userDto;
            this.avatar = getFirstAndLastName(this.user.fullName);
          }
        }
      )

  }

  setAuthority() {
    for (const argument of this.auth.getRoleFromJwt()) {
      if (argument.authority === Role.PRINCIPAL) {
        this.isPrincipal = true;
      }
      if (argument.authority === Role.ADMIN) {
        this.isAdmin = true;
      }
      if (argument.authority === Role.DIRECTOR) {
        this.isDirector = true;
      }
    }
  }

  isUpdatable(updateUser: UserResponseForUserList) {
    if (updateUser.accountRoles?.some(value => value.role?.roleName === Role.ADMIN)) {
      return false;
    }
    if (updateUser.school?.schoolId == 1 && (this.isDirector || this.isAdmin)) {
      if (this.isDirector && updateUser.accountRoles?.some(value => value.role?.roleName === Role.DIRECTOR)) {
        return false;
      }
      return true;
    }
    if (updateUser.school?.schoolId != 1 && (this.isAdmin || this.isPrincipal)) {
      if (this.isPrincipal && updateUser.accountRoles?.some(value => value.role?.roleName === Role.PRINCIPAL)) {
        return false;
      }
      return true;
    }
    return false;
  }

  onUpdate() {
    this.router.navigate(['user/update/' + this.user.userId])
  }
}
