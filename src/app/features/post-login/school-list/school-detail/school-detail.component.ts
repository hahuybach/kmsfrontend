import {Component, OnInit} from '@angular/core';
import {SchoolResponse} from "../../../../models/school-response";
import {switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SchoolService} from "../../../../services/school.service";
import {AccountResponse} from "../../../../models/account-response";
import {Role} from "../../../../shared/enum/role";
import {AuthService} from "../../../../services/auth.service";
import {ToastService} from "../../../../shared/toast/toast.service";

@Component({
    selector: 'app-school-detail',
    templateUrl: './school-detail.component.html',
    styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent implements OnInit {
    school: SchoolResponse;
    principal: AccountResponse
    isDirector: boolean
    isPrincipal: boolean

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
                    return this.schoolService.findSchoolById(params['id']);
                })
            )
            .subscribe((data) => {
                this.school = data;
                this.principal = data.principal;

                console.log(this.school);
                console.log(this.principal)
            },
                error => {
                    this.toastService.showWarn('error', "Lỗi", error.error.message)
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
}
