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

  public getInspectionPlans(): Observable<any[]> {
    let headers = new HttpHeaders();
    const url = `${this.inspectionApiUrl}/list`;
    return this.http.get<any[]>(url, { headers });
  }
  public getInspectionPlanById(inspectionPlanId: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.inspectionApiUrl}/detail/${inspectionPlanId}`;
    return this.http.get(url, { headers });
  }
}
