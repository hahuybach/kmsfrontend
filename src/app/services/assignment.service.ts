import { Injectable } from '@angular/core';
import { LoggerService } from './LoggerService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class AssignmentService {
  private assignmentApiUrl = 'http://localhost:8080/api/v1/assignment/';

  constructor(private http: HttpClient) {
    console.log('AssignmentService constructed');
  }
  public getAssignmentsByIssueId(issueId: number): Observable<any[]> {
    let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'undefined');
    const url = `${this.assignmentApiUrl}dept/get_by_issue_id/${issueId}`;
    console.log(url);
    return this.http.get<any[]>(url, { headers });
  }
  public getAssignmentsById(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.assignmentApiUrl}get_assignment_by_id/${id}`;
    console.log(url);
    return this.http.get<any[]>(url, { headers });
  }
  public getAssignmentsToSubmit(issueId: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.assignmentApiUrl}my_isTaskTrue_assignments_by_issue_id/${issueId}`;
    console.log(url);
    return this.http.get<any[]>(url, { headers });
  }
  public getAssignmentsToAssign(issueId: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.assignmentApiUrl}my_isTaskFalse_assignments_by_issue_id/${issueId}`;
    console.log(url);
    return this.http.get<any[]>(url, { headers });
  }
  public getAssignmentsToApprove(issueId: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.assignmentApiUrl}my_assignments_toAprrove_by_issue_id/${issueId}`;
    console.log(url);
    return this.http.get<any[]>(url, { headers });
  }
  public sendAssignmentsToSchool(issueId: number): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}assign_assignments_to_school/issue_id/${issueId}`;
    return this.http.post(url, { headers });
  }
  public deleteAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}delete`;
    return this.http.delete(url, { headers: headers, body: data });
  }
  public addAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}add`;
    return this.http.post(url, data, { headers });
  }
  public updateAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}update`;
    return this.http.put(url, data, { headers });
  }
  public submitAssignment(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');

    const url = `${this.assignmentApiUrl}submit_task`;
    console.log(url);
    return this.http.put(url, formData, { headers });
  }
  public evaluateAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    // headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}evaluate_task`;
    return this.http.put(url, data, { headers });
  }
}
