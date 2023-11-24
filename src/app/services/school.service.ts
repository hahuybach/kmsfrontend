import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {DomainName} from "../shared/enum/domain-name";

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  baseUrl: string = DomainName.URL + 'api/v1/school/'

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
  public getSchools(): Observable<any[]> {
    let headers = new HttpHeaders();
    const url = `${this.baseUrl}list`;
    return this.httpClient.get<any[]>(url, {headers});
  }
  uploadFileExcel(data : any){
    const formData : FormData = new FormData();
    formData.append("file", data);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');
    return  this.httpClient.post<any>(this.baseUrl + "excel", formData, { headers })
  }

  getSchoolTemplate(){
    return this.httpClient.get(this.baseUrl + "exportTemplate", {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
