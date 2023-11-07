import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  baseUrl: string = 'http://localhost:8080/api/v1/school/'

  constructor(private httpClient: HttpClient) {
  }

  findAll() {
    return this.httpClient.get<any>(this.baseUrl + 'findAll')
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
}
