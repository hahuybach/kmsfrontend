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
    isDirector: boolean
    isPrincipal: boolean
    sub: any[] = []

    constructor(private route: ActivatedRoute,
                private schoolService: SchoolService,
                private routeLink: Router,
                private auth: AuthService,
                private toastService: ToastService) {
    }

    setAuth() {
        for (const role of this.auth.getRoleFromJwt()) {
            if (role.authority === Role.DIRECTOR) {
                this.isDirector = true;
            }
            if (role.authority === Role.PRINCIPAL) {
                this.isPrincipal = true;
            }
        }
    }

    ngOnInit(): void {
        this.setAuth()
        this.route.params
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
                    this.toastService.showWarn('error', "Lỗi", error.error.message);
                    this.schoolService.findSchoolById(this.auth.getSchoolFromJwt().schoolId).subscribe({
                      next: (data) => {
                        this.school = data;
                        this.principal = data.principal;
                      },error: (error) => {
                        this.toastService.showWarn('error', "Lỗi", error.error.message);
                      }
                    })

                }

            );
    }

    findAccountWithRole(school: SchoolResponse, roleName: string): AccountResponse {
        const account = school.accountDtos.find((account) => {
            const roles = account.roles || [];
            return roles.some((role) => role.roleName === roleName);
        });

        return account as AccountResponse;
    }


    onUpdate() {
        this.routeLink.navigate(['school/' + this.school.schoolId + '/update'])
    }

  ngOnDestroy(): void {
      unSub(this.sub);
  }
}
