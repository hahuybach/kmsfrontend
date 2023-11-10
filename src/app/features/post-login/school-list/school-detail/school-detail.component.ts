import {Component, OnInit} from '@angular/core';
import {SchoolResponse} from "../../../../models/school-response";
import {switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SchoolService} from "../../../../services/school.service";
import {AccountResponse} from "../../../../models/account-response";

@Component({
  selector: 'app-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent implements OnInit{
  school: SchoolResponse;
  principal: AccountResponse
  constructor(private route: ActivatedRoute,
              private schoolService: SchoolService,
              private routeLink: Router) {
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
          this.principal = data.principal;

          console.log(this.school);
          console.log(this.principal)
        });
  }
     findAccountWithRole(school: SchoolResponse, roleName: string): AccountResponse {
        const account = school.accountDtos.find((account) => {
            const roles = account.roles || [];
            return roles.some((role) => role.roleName === roleName);
        });

        return  account as AccountResponse;
    }


    onUpdate() {
        this.routeLink.navigate(['school/' + this.school.schoolId + '/update'])
    }
}
