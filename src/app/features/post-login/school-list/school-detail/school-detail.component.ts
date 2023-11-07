import {Component, OnInit} from '@angular/core';
import {SchoolResponse} from "../../../../models/school-response";
import {switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {SchoolService} from "../../../../services/school.service";
import {AccountResponse} from "../../../../models/account-response";

@Component({
  selector: 'app-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent implements OnInit{
  school: SchoolResponse;
  principal: any
  constructor(private route: ActivatedRoute,
              private schoolService: SchoolService) {
  }
  ngOnInit(): void {
    this.route.params
        .pipe(
            switchMap((params) => {
              return this.schoolService.findSchoolById(params['id']);
            })
        )
        .subscribe((data) => {
          this.school = data;
          this.principal = this.findAccountWithRole(this.school,'Hiệu Trưởng');

          console.log(this.school);
          console.log(this.principal)
        });
  }
     findAccountWithRole(school: SchoolResponse, roleName: string): AccountResponse | undefined {
        const account = school.accountDtos.find((account) => {
            const roles = account.roles || [];
            return roles.some((role) => role.roleName === roleName);
        });

        return account;
    }


}
