import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DomainName} from "../shared/enum/domain-name";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = DomainName.URL + "api/v1/role/"
  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<any>(this.baseUrl + 'findAll');
  }

  findSchoolRole(){
    return this.http.get<any>(this.baseUrl + 'findSchoolRoles');
  }

  // this one does not have admin, inspector role and director roles
  findDeptRoles(){
    return this.http.get<any>(this.baseUrl + 'findDeptRoles');
  }


  // this one have every roles in the department
  findAllDeptRoles(){
    return this.http.get<any>(this.baseUrl + 'findAllDeptRoles')
  }
}
