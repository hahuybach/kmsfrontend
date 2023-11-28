import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Issue } from 'src/app/models/issue.model';
import { IssueService } from 'src/app/services/issue.service';
import {ToastService} from "../../../shared/toast/toast.service";
import {Role} from "../../../shared/enum/role";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss'],
})
export class IssueListComponent implements OnInit {
  data: any;
  issues!: any[];
  loading: boolean = true;
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
  constructor(private issueService: IssueService, private router: Router
  ,private toastService: ToastService, private auth: AuthService
  ) {}

  ngOnInit() {
    this.setAuth()
    this.issueService.getIssues().subscribe({
      next: (data) =>{
        this.data = data;
        this.issues = this.data.issueTableRow;
      },
      error: (error) => {
        this.toastService.showWarn("error", "Lỗi", error.error.message);
      }
    })

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
  navigateToCreateIssue() {
    this.router.navigate(['/createissue']);
  }
  navigateToDetail(issueId: number) {
    this.router.navigate(['/issuelist', issueId]);
  }
  navigateToUpdate(issueId: number) {
    this.router.navigate(['/issuelist/update', issueId]);
  }
}
