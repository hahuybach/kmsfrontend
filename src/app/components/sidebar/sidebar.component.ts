import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Role} from '../../shared/enum/role';
import {IssueService} from 'src/app/services/issue.service';
import {unSub} from "../../shared/util/util";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {

  schoolId: any;
  issueId: number;
  sub: any[] = []
  isPrincipal: boolean = false;
  isDirector: boolean = false;
  isAdmin: boolean = false;
  isInspector: boolean = false;
  isChiefInspector: boolean = false;
  isViceDirector: boolean = false;
  isSchoolNormalEmp: boolean = false;
  isSpecialist: boolean = false;
  schoolRoles: any[] = [Role.VICE_PRINCIPAL, Role.CHIEF_TEACHER, Role.CHIEF_OFFICE, Role.TEACHER,
    Role.ACCOUNTANT, Role.MEDIC, Role.CLERICAL_ASSISTANT, Role.SECURITY]

  constructor(
    private auth: AuthService,
    private router: Router,
    private issueService: IssueService
  ) {
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
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
    console.log(this.auth.getRoleFromJwt());
    if (this.auth.getSchoolFromJwt()) {
      this.schoolId = this.auth.getSchoolFromJwt().schoolId;
    }
    this.setAuth();

    const method = this.issueService.getCurrentActiveIssue().subscribe({
      next: (data) => {
        console.log("current issue" + data);
        this.issueId = data.issueDto.issueId;
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
    this.sub.push(method)
  }


  ngOnDestroy(): void {
    unSub(this.sub)
  }
}
