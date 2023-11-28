import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../../../services/account.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserResponseForUserList} from "../../../../models/user-response-for-user-list";
import {Role} from "../../../../shared/enum/role";
import {AuthService} from "../../../../services/auth.service";

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
    user: UserResponseForUserList;
    isPrincipal: boolean;
    isAdmin: boolean;
    isDirector: boolean

    constructor(private accountService: AccountService,
                private router: Router,
                private activateRouter: ActivatedRoute,
                private auth: AuthService) {
    }

    ngOnInit(): void {
        this.setAuthority();
        this.accountService.findById(this.activateRouter.snapshot.paramMap.get('id'))
            .subscribe(
                {
                    next: (data) => {
                        this.user = data.userDto;
                        console.log(this.user);
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
        this.router.navigate(['userList/' + this.user.userId + '/update'])
    }
}
