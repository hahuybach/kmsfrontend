import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = "http://localhost:8080/api/v1/role/"
  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<any>(this.baseUrl + 'findAll');
  }
  findSchoolRole(){
    return this.http.get<any>(this.baseUrl + 'findSchoolRoles');
  }

  // this one does not have admin or inspector role
  findDeptRoles(){
    return this.http.get<any>(this.baseUrl + 'findDeptRoles');
  }
}
