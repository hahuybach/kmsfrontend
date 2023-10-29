import { Injectable } from '@angular/core';
import { LoggerService } from './LoggerService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
@Injectable()
export class IssueService {
  private issueApiUrl = 'http://localhost:8080/api/v1/issue';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Issue service constructed');
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
<<<<<<< HEAD
  // public updateIssue(formData: FormData): Observable<any> {
  //   let headers = new HttpHeaders().append('Content-Type', 'undefined');
  //   const url = `${this.issueApiUrl}/`;
  //   return this.http.put(url, formData, { headers });
  // }
=======

  public getCurrentActiveIssue(): Observable<any>{
    let headers = new HttpHeaders();
    const url = `${this.issueApiUrl}/current`;
    return this.http.get<any>(url, { headers });
  }
>>>>>>> da23019be747f5da2724f44e16ade0f57474b7f3
}
