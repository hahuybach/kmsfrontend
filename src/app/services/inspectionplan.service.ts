import {Injectable} from "@angular/core";
import {LoggerService} from "./LoggerService";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {DomainName} from "../shared/enum/domain-name";

@Injectable()
export class inspectionPlanService {
  private inspectionApiUrl =DomainName.URL + 'api/v1/inspection_plan';

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
                       planName: string = '', statusId?: any,issue? : any,school? :any,creationStartDateTime? : any,creationEndDateTime?: any,
                       deadlineStartDateTime?: any, deadlineEndDateTime? : any) {
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
      params = params.set('creationStartDateTime', new Date(creationStartDateTime.toString()).toISOString());
    }

    if (creationEndDateTime) {
      params = params.set('creationEndDateTime', new Date(creationEndDateTime).toISOString());
    }
    if (deadlineStartDateTime) {
      params = params.set('deadlineStartDateTime', new Date(deadlineStartDateTime).toISOString());
    }
    if (deadlineEndDateTime) {
      params = params.set('deadlineEndDateTime', new Date(deadlineEndDateTime).toISOString());
    }
    console.log(params);

    // Make the GET request
    return this.http.get<any>(this.inspectionApiUrl + '/filter', {params, headers});
  }

}
