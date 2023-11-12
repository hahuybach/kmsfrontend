import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  baseUrl: string = 'http://localhost:8080/api/v1/school/'

  constructor(private httpClient: HttpClient) {
  }
// cái này tìm tất cả
  findAll() {
    return this.httpClient.get<any>(this.baseUrl + 'findAll')
  }
  // cái này tìm ngoại trừ cái PGD
  findAllSchools() {
    return this.httpClient.get<any>(this.baseUrl + 'findAllSchool')
  }
  isSchoolNameUnique(schoolName : string){
    const request = {
      schoolName
    }
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.baseUrl + 'isSchoolNameUnique', JSON.stringify(request), {headers})

  }
  saveSchool(request: any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.baseUrl + 'save', JSON.stringify(request), {headers})
  }
  findSchoolById(schoolId: number){
    return this.httpClient.get<any>(this.baseUrl + schoolId)
  }

  updateSchool(request: any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.put<any>(this.baseUrl + 'update', JSON.stringify(request), {headers})

  }
}
