import { Injectable } from '@angular/core';
import { LoggerService } from './LoggerService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DomainName} from "../shared/enum/domain-name";
@Injectable()
export class IssueService {
  private issueApiUrl = DomainName.URL +  'api/v1/issue';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Issue service constructed');
  }

  public saveIssue(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');

    const url = `${this.issueApiUrl}/save`;
    return this.http.post(url, formData, {headers});
  }

  public getIssues(): Observable<any[]> {
    let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'undefined');
    const url = `${this.issueApiUrl}/findAll`;
    return this.http.get<any[]>(url, { headers });
  }

  public getIssueById(issueId: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.issueApiUrl}/${issueId}`;
    return this.http.get(url, { headers });
  }
  public getDocumentById(documentLink: string): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.issueApiUrl}/${documentLink}`;
    return this.http.get(url, { headers });
  }
  public updateIssue(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');

    const url = `${this.issueApiUrl}/`;
    return this.http.put(url, formData, { headers });
  }

  public getCurrentActiveIssue(): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.issueApiUrl}/current`;
    return this.http.get<any>(url, { headers });
  }

  public getIssueDropDownResponse(){
    return this.http.get<any>(this.issueApiUrl + "/findAll/dropDown");
  }
}
