import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Issue } from 'src/app/models/issue.model';
import { IssueService } from 'src/app/services/issue.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { Role } from '../../../../shared/enum/role';
import { AuthService } from '../../../../services/auth.service';
import { unSub } from '../../../../shared/util/util';
import { error } from '@angular/compiler-cli/src/transformers/util';
import { FilterMatchMode } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss'],
})
export class IssueListComponent implements OnInit, OnDestroy {
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
  schoolRoles: any[] = [
    Role.VICE_PRINCIPAL,
    Role.CHIEF_TEACHER,
    Role.CHIEF_OFFICE,
    Role.TEACHER,
    Role.ACCOUNTANT,
    Role.MEDIC,
    Role.CLERICAL_ASSISTANT,
    Role.SECURITY,
  ];
  sub: any[] = [];
  @ViewChild('dt') dt: Table;
  filterVisible: Boolean = false;
  constructor(
    private issueService: IssueService,
    private router: Router,
    private toastService: ToastService,
    private auth: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.setAuth();
    const sub = this.issueService.getIssues().subscribe({
      next: (data) => {
        this.data = data;
        this.issues = this.data.issueTableRow;
      },
      error: (error) => {
        this.toastService.showWarn('error', 'Lỗi', error.error.message);
      },
    });
    this.sub.push(sub);
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
        if (this.schoolRoles.some((value) => value === argument.authority)) {
          this.isSchoolNormalEmp = true;
        }
      }
    }
  }

  navigateToCreateIssue() {
    this.router.navigate(['/issue/create']);
  }

  navigateToDetail(issueId: number) {
    this.router.navigate(['/issue', issueId]);
  }

  navigateToUpdate(issueId: number) {
    this.router.navigate(['/issue/update', issueId]);
  }

  ngOnDestroy(): void {
    unSub(this.sub);
  }
  formatCreatedDate(createdDate: string): string | null {
    const dateObj = new Date(createdDate);
    return this.datePipe.transform(dateObj, 'dd/MM/yyyy');
  }
  changeFilterVisible(status: Boolean) {
    this.filterVisible = status;
  }
}
