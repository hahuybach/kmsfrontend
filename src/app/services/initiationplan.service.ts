import { Injectable } from '@angular/core';
import { LoggerService } from './LoggerService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class InitiationplanService {
  private initiationplanApiUrl =
    'http://localhost:8080/api/v1/initiation_plan/';

  constructor(private http: HttpClient) {
    console.log('InitiationplanService constructed');
  }
  public getInitiationPlans(): Observable<any[]> {
    let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'undefined');
    const url = `${this.initiationplanApiUrl}list`;
    return this.http.get<any[]>(url, { headers });
  }
  public getInitiationPlanById(initiationPlanId: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.initiationplanApiUrl}${initiationPlanId}`;
    console.log(url);
    return this.http.get(url, { headers });
  }
  public putUploadSchoolDoc(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');

    const url = `${this.initiationplanApiUrl}upload_school_document`;
    return this.http.put(url, formData, { headers });
  }
  public putEvaluateSchoolDoc(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');

    const url = `${this.initiationplanApiUrl}evaluate_school_document`;
    return this.http.put(url, formData, { headers });
  }
}
