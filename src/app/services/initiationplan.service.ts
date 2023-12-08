import { Injectable } from '@angular/core';
import { LoggerService } from './LoggerService';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {DomainName} from "../shared/enum/domain-name";
import {toIsoString} from "../shared/util/util";
@Injectable()
export class InitiationplanService {
  private initiationplanApiUrl =
   DomainName.URL + 'api/v1/initiation_plan/';

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

  filterInitiationPlan(pageNo: number = 0, pageSize: number = 5, sortBy: string = 'createdDate', sortDirection: string = 'asc',
                       planName: string = '', statusId?: any,issue? : any,school? :any,creationStartDateTime? : any,creationEndDateTime?: any,
                       deadlineStartDateTime?: any, deadlineEndDateTime? : any) {
    console.log("status after service " + statusId);
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('planName', planName)
    if (pageNo != null && pageNo > 0) {
      pageNo = pageNo - 1;
      params = params.set('pageNo', pageNo)
    }
    if (issue) {
      params = params.set('issueId', issue.issueId)
    }
    if (statusId) {
      params = params.set('statusId', statusId)
    }
    if (school) {
      params = params.set('schoolId', school.schoolId)
    }
    if (creationStartDateTime) {
      params = params.set('creationStartDateTime', toIsoString(creationStartDateTime));
    }

    if (creationEndDateTime) {
      params = params.set('creationEndDateTime', toIsoString(creationEndDateTime));
    }
    if (deadlineStartDateTime) {
      params = params.set('deadlineStartDateTime', toIsoString(deadlineStartDateTime));
    }
    if (deadlineEndDateTime) {
      params = params.set('deadlineEndDateTime', toIsoString(deadlineEndDateTime));
    }
    console.log(params);

    // Make the GET request
    return this.http.get<any>(this.initiationplanApiUrl + 'list', {params, headers});
  }
}
