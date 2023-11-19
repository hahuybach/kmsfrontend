import {Injectable} from "@angular/core";
import {LoggerService} from "./LoggerService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class inspectionPlanService {
  private inspectionApiUrl = 'http://localhost:8080/api/v1/inspection_plan';

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
}
