import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }
  logout(){
    this.auth.logout();
    this.router.navigateByUrl("/login");
  }
}
