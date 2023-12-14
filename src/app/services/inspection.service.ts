import { Injectable } from '@angular/core';
import {LoggerService} from "./LoggerService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {DomainName} from "../shared/enum/domain-name";

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private inspectionApiUrl = DomainName.URL +  'api/v1/inspection';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Inspection service constructed');
  }

  public getInspectionInformation(inspectionId: number | null): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.inspectionApiUrl}/info/${inspectionId}`;
    return this.http.get(url, {headers});
  }
  public getInspectionDocument(inspectionId: number | null): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.inspectionApiUrl}/inspection_doc/${inspectionId}`;
    return this.http.get(url, {headers});
  }



}
