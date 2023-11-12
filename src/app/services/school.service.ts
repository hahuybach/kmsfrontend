import { Injectable } from '@angular/core';
import {LoggerService} from "./LoggerService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  private schoolApiUrl = 'http://localhost:8080/api/v1/school';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('School plan service constructed');
  }
  public getSchools(): Observable<any[]> {
    let headers = new HttpHeaders();
    const url = `${this.schoolApiUrl}/list`;
    return this.http.get<any[]>(url, {headers});
  }
}
