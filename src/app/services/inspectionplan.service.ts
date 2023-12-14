import {Injectable} from "@angular/core";
import {LoggerService} from "./LoggerService";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {DomainName} from "../shared/enum/domain-name";
import {toIsoString} from "../shared/util/util";

@Injectable()
export class inspectionPlanService {
  private inspectionApiUrl = DomainName.URL + 'api/v1/inspection_plan';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Inspection plan service constructed');
  }

  public saveInspectionPlan(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');

    const url = `${this.inspectionApiUrl}/save`;
    return this.http.post(url, formData, {headers});
  }

  public getInspectionPlans(): Observable<any[]> {
    let headers = new HttpHeaders();
    const url = `${this.inspectionApiUrl}/list`;
    return this.http.get<any[]>(url, {headers});
  }

  public getEligibleSchool(): Observable<any[]> {
    let headers = new HttpHeaders();
    const url = `${this.inspectionApiUrl}/get_eligible_school`;
    return this.http.get<any[]>(url, {headers});
  }

  public getEligibleInspector(startDate: string, endDate: string): Observable<any[]> {
    let headers = new HttpHeaders();
    const url = `${this.inspectionApiUrl}/get_eligible_inspector?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<any[]>(url, {headers});
  }

  public getInspectionPlanById(inspectionPlanId: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.inspectionApiUrl}/detail/${inspectionPlanId}`;
    return this.http.get(url, {headers});
  }

  public updateInspectionPlan(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');
    const url = `${this.inspectionApiUrl}/update`;
    return this.http.put(url, formData, {headers});
  }


  filterInspectionPlan(pageNo: number = 0, pageSize: number = 5, sortBy: string = 'startDate', sortDirection: string = 'asc',
                       planName: string = '', statusId?: any, issue?: any, school?: any, creationStartDateTime?: any, creationEndDateTime?: any,
                       deadlineStartDateTime?: any, deadlineEndDateTime?: any, isMine?: any) {
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('planName', planName)

    if (isMine != null){
      params = params.set('isMine', isMine)

    }
    if (pageNo != null && pageNo > 0) {
      pageNo = pageNo - 1;
      params = params.set('pageNo', pageNo)
    }
    if (issue) {
      params = params.set('issueId', issue)
    }
    if (statusId) {
      params = params.set('statusId', statusId)
    }
    if (school) {
      params = params.set('schoolId', school)
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
    return this.http.get<any>(this.inspectionApiUrl + '/filter', {params, headers});
  }

  getNumberOfInspectedSchool(issueId: any) {
    return this.http.get<any>(this.inspectionApiUrl + '/getNumberOfInspectedSchool?issueId=' + issueId);
  }

  getDashboardInspectionPlanResponse(issueId: any){
    return this.http.get<any>(this.inspectionApiUrl + '/getDashboardInspectionPlanResponse?issueId=' + issueId);

  }
  public getInspectionDoctree(inspectionId: number | null): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.inspectionApiUrl}/get-doc-tree-info/${inspectionId}`;
    return this.http.get(url, {headers});
  }

  public finishInspectionPlan(inspectionPlanId: any) {
    const request = Number(inspectionPlanId);
    console.log(request);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.inspectionApiUrl + '/finish', request, { headers });
  }
}
