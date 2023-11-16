import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl: string = 'http://localhost:8080/api/v1/user/'

  constructor(private httpClient: HttpClient) {
  }

  isUnique(email: string) {
    const request = {
      email
    };
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.baseUrl + 'isEmailUnique', JSON.stringify(request), {headers});
  }

  filterAccount(pageNo: number = 0,
                pageSize: number = 5,
                sortBy: string = 'user.userId',
                sortDirection: string = 'asc',
                fullName: string = '',
                gender: string = '',
                phoneNumber: string = '',
                isActive?: any,
                globalSearch?: any,
                email?: any,
                role?: any,
                school?: any) {
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('gender', gender)
      .set('phoneNumber', phoneNumber)
      .set('fullName', fullName)
      .set('globalSearch', globalSearch)
      .set('isActive', isActive)
      .set('email', email)

    if (pageNo != null && pageNo > 0) {
      pageNo = pageNo - 1;
      params = params.set('pageNo', pageNo)
    }
    if (school) {
      params = params.set('schoolId', school.schoolId)
    }
    if (role) {
      params = params.set('roleId', role.roleId)
    }
    if (isActive !== undefined) {
      params = params.set('isActive', isActive)
    }
    console.log(params);
    return this.httpClient.get<any>(this.baseUrl + 'list', {params, headers})

  }

  getCurrentUser() {
    return this.httpClient.get<any>(this.baseUrl + 'currentUser')
  }

  findById(id: any){
    return this.httpClient.get<any>(this.baseUrl + id);
  }

  saveUser(data : any){
    let headers = new HttpHeaders();
    console.log(data.value)
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.baseUrl + 'create', JSON.stringify(data.value), {headers});

  }

  findBySchoolIdAndRoleNameAndStatus(data :any){
    console.log(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.baseUrl + 'findByRoleNameSchoolIdAndStatus', JSON.stringify(data), {headers});
  }

  updateUser(data : any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.put<any>(this.baseUrl + 'update', JSON.stringify(data), {headers});
  }

}
