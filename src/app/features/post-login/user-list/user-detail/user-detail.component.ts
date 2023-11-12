import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../../../services/account.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserResponseForUserList} from "../../../../models/user-response-for-user-list";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit{
  user: UserResponseForUserList
  constructor(private accountService: AccountService,
              private router: Router,
              private activateRouter: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.accountService.findById(this.activateRouter.snapshot.paramMap.get('id'))
      .subscribe(
        {
          next: (data) =>{
            this.user = data.userDto;
            console.log(this.user);
          }
        }
      )

  }


}
