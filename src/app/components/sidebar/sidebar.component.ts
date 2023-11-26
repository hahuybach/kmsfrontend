import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Role } from '../../shared/enum/role';
import { IssueService } from 'src/app/services/issue.service';
import { error } from '@angular/compiler-cli/src/transformers/util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isPrincipal: boolean = false;
  isDirector: boolean = false;
  isAdmin: boolean = false;
  isTeacher: boolean = false;
  isChiefTeacher: boolean = false;
  schoolId: any;
  issueId: number;
  constructor(
    private auth: AuthService,
    private router: Router,
    private issueService: IssueService
  ) {}
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {
    console.log(this.auth.getRoleFromJwt());
    // this.schoolId = this.auth.getSchoolFromJwt().schoolId;
    this.issueService.getCurrentActiveIssue().subscribe({
      next: (data) => {
        this.issueId = data.issueDto.issueId;
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
    for (const argument of this.auth.getRoleFromJwt()) {
      if (argument.authority === 'Trưởng Phòng') {
        this.isDirector = true;
      }
      if (argument.authority === 'Hiệu Trưởng') {
        this.isPrincipal = true;
      }
      if (argument.authority === Role.ADMIN) {
        this.isAdmin = true;
      }
      if (argument.authority === Role.TEACHER) {
        this.isTeacher = true;
      }
      if (argument.authority === Role.CHIEF_TEACHER) {
        this.isChiefTeacher = true;
      }
    }
  }
}
