import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  isPrincipal: boolean
  isDirector: boolean

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
    for (const argument of this.auth.getRoleFromJwt()) {
      if (argument.authority === "Trưởng Phòng") {
        this.isDirector = true;
      }
      if (argument.authority === "Hiệu Trưởng") {
        this.isPrincipal = true;

      }
    }
  }
}
