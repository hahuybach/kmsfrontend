import {Component, OnDestroy, OnInit} from '@angular/core';
import {SchoolResponse} from "../../../../models/school-response";
import {switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SchoolService} from "../../../../services/school.service";
import {AccountResponse} from "../../../../models/account-response";
import {Role} from "../../../../shared/enum/role";
import {AuthService} from "../../../../services/auth.service";
import {ToastService} from "../../../../shared/toast/toast.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {unSub} from "../../../../shared/util/util";

@Component({
    selector: 'app-school-detail',
    templateUrl: './school-detail.component.html',
    styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent implements OnInit, OnDestroy {
    school: SchoolResponse;
    principal: AccountResponse
  isPrincipal: boolean = false;
  isDirector: boolean = false;
  isAdmin: boolean = false;
  isInspector: boolean = false;
  isChiefInspector: boolean = false;
  isViceDirector: boolean = false;
  isSchoolNormalEmp: boolean = false;
  isSpecialist: boolean = false;
  schoolRoles: any[] = [Role.VICE_PRINCIPAL, Role.CHIEF_TEACHER, Role.CHIEF_OFFICE, Role.TEACHER,
    Role.ACCOUNTANT, Role.MEDIC, Role.CLERICAL_ASSISTANT, Role.SECURITY];
    sub: any[] = []

  breadCrumb = [
    {
      caption: 'Trang chủ',
      routerLink: '/',
    },
    {
      caption: 'Danh sách các trường',
      routerLink: '/school/list',
    },
    {
      caption: 'Chi tiết trường'
    },
  ];

    constructor(private route: ActivatedRoute,
                private schoolService: SchoolService,
                private routeLink: Router,
                private auth: AuthService,
                private toastService: ToastService) {
    }

  setAuth() {
    if (this.auth.getRolesFromCookie()) {
      for (const argument of this.auth.getRoleFromJwt()) {
        if (argument.authority === Role.DIRECTOR) {
          this.isDirector = true;
        }
        if (argument.authority === Role.PRINCIPAL) {
          this.isPrincipal = true;
        }
        if (argument.authority === Role.ADMIN) {
          this.isAdmin = true;
        }
        if (argument.authority === Role.VICE_DIRECTOR) {
          this.isViceDirector = true;
        }
        if (argument.authority === Role.INSPECTOR) {
          this.isInspector = true;
        }
        if (argument.authority === Role.CHIEF_INSPECTOR) {
          this.isChiefInspector = true;
        }
        if (argument.authority === Role.SPECIALIST) {
          this.isSpecialist = true;
        }
        if (this.schoolRoles.some(value => value === argument.authority)) {
          this.isSchoolNormalEmp = true;
        }

      }

    }
  }

    ngOnInit(): void {
        this.setAuth()
    const sub =    this.route.params
            .pipe(
                switchMap((params) => {
                  const sub = this.schoolService.findSchoolById(params['id']);
                    return sub;
                })
            )
            .subscribe((data) => {
                this.school = data;
                this.principal = data.principal;

                console.log(this.school);
                console.log(this.principal)
            },
                error => {
                    this.toastService.showWarn('toastSchoolDetail', "Lỗi", error.error.message);
                    this.schoolService.findSchoolById(this.auth.getSchoolFromJwt().schoolId).subscribe({
                      next: (data) => {
                        this.school = data;
                        this.principal = data.principal;
                      },error: (error) => {
                        this.toastService.showWarn('toastSchoolDetail', "Lỗi", error.error.message);
                      }
                    })

                }

            );
        this.sub.push(sub);
    }

    findAccountWithRole(school: SchoolResponse, roleName: string): AccountResponse {
        const account = school.accountDtos.find((account) => {
            const roles = account.roles || [];
            return roles.some((role) => role.roleName === roleName);
        });

        return account as AccountResponse;
    }


    onUpdate() {
        this.routeLink.navigate(['/school/update/' + this.school.schoolId])
    }

  ngOnDestroy(): void {
      unSub(this.sub);
  }
}
