import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Role} from "../../shared/enum/role";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  isPrincipal: boolean =false
  isDirector: boolean = false
  isAdmin: boolean = false
  schoolId: any;
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }
  logout(){
    this.auth.logout();
    this.router.navigateByUrl("/login");
  }

  ngOnInit(): void {
    console.log(this.auth.getRoleFromJwt());
    this.schoolId = this.auth.getSchoolFromJwt().schoolId;
    for (const argument of this.auth.getRoleFromJwt()) {
      if (argument.authority === "Trưởng Phòng") {
        this.isDirector = true;
      }
      if (argument.authority === "Hiệu Trưởng") {
        this.isPrincipal = true;

      }
      if (argument.authority === Role.ADMIN) {
        this.isAdmin = true;

      }
    }
  }
}
