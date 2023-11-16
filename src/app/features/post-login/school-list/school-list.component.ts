import {Component, OnInit} from '@angular/core';
import {SchoolResponse} from "../../../models/school-response";
import {SchoolService} from "../../../services/school.service";
import {Table} from "primeng/table";
import {FilterMatchMode, PrimeNGConfig} from "primeng/api";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {Role} from "../../../shared/enum/role";

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit{
  schools: SchoolResponse[];
  statuses: any[];
  selectedSchool: SchoolResponse;
  isDirector: boolean
  constructor(private schoolService: SchoolService,
              private config: PrimeNGConfig,
              private router: Router,
              private auth: AuthService
              ) {

  }

  setAuth(){
    for (const role of this.auth.getRoleFromJwt()) {
      if (role.authority === Role.DIRECTOR){
        this.isDirector = true;
      }
    }
  }

  ngOnInit(): void {
    this.setAuth()
    this.schoolService.findAllSchools().subscribe({

        next: (value) => {
            this.schools = value;
            console.log(this.schools);
        }
    })
    this.statuses = [
      {label: 'Đang hoạt động', value: true},
      {label: 'Ngưng hoạt động', value: false}
    ]
    this.config.setTranslation({
      startsWith: 'Bắt đầu bằng',
      contains: 'Bao gồm',
      notContains: 'Không bao gồm',
      endsWith: 'Kết thúc bằng',
      equals: 'Bằng',
      notEquals: 'Không bằng',
      noFilter: 'Bỏ lọc',
      lt: 'Bé hơn',
    });


  }
    clear(table: Table) {
        table.clear();
    }


  onDetail(schoolId: any) {
      this.router.navigate(['school/' + schoolId])
  }

  onCreateSchool() {
    this.router.navigate(['/schools/create'])
  }

  onUpdate(schoolId: any) {
    this.router.navigate(['school/' + schoolId + '/update'])
  }
}
