import { Injectable } from '@angular/core';
import { LoggerService } from './LoggerService';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class AssignmentService {
  private assignmentApiUrl = 'http://localhost:8080/api/v1/assignment/';

  constructor(private http: HttpClient) {
    console.log('AssignmentService constructed');
  }
  // GET
  public getAssignmentsById(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.assignmentApiUrl}get_assignment_by_id/${id}`;
    console.log(url);
    return this.http.get<any[]>(url, { headers });
  }
  // public getMyAssignedAssignments(): Observable<any> {
  //   let headers = new HttpHeaders();
  //   const url = `${this.assignmentApiUrl}my_assigned_assignments`;
  //   return this.http.get<any[]>(url, { headers });
  // }
  public getPossibleAssignee(object: any): Observable<any> {
    const url = `${this.assignmentApiUrl}load_add_school_assignment`;
    console.log(url);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    return this.http.post<any>(url, object, { headers: headers });
  }
  public getDeptAssignments(): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.assignmentApiUrl}get_dept_assignment`;
    return this.http.get<any[]>(url, { headers });
  }
  public getCommentsByAssignmentId(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.assignmentApiUrl}get_comments_by_assignment_id/${id}`;
    console.log(url);
    return this.http.get<any[]>(url, { headers });
  }
  public getHistoryByAssignmentId(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.assignmentApiUrl}get_history_by_assignment_id/${id}`;
    console.log(url);
    return this.http.get<any[]>(url, { headers });
  }
  // DELETE
  public deleteAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}delete`;
    return this.http.delete(url, { headers: headers, body: data });
  }
  public deleteDeptAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}delete_dept_assignment`;
    return this.http.delete(url, { headers: headers, body: data });
  }
  public deleteDocument(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}delete_document`;
    return this.http.delete(url, { headers: headers, body: data });
  }
  public deleteComment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}delete_comment`;
    return this.http.delete(url, { headers: headers, body: data });
  }
  // POST
  public initDeptRootAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}init_dept_root_assignment`;
    return this.http.post(url, data, { headers });
  }
  public sendAssignmentsToSchool(): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}assign_assignments_to_school`;
    return this.http.post(url, { headers });
  }
  public addSchoolAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}add_school_assignment`;
    return this.http.post(url, data, { headers });
  }
  public addDeptAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}add_dept_assignment`;
    return this.http.post(url, data, { headers });
  }
  public addComment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}add_comment`;
    return this.http.post(url, data, { headers });
  }

  // PUT
  public uploadDocument(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');

    const url = `${this.assignmentApiUrl}upload_document`;
    return this.http.put(url, formData, { headers });
  }
  public updateSchoolAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}update_school_assignment`;
    return this.http.put(url, data, { headers });
  }
  public updateDeptAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}update_dept_assignment`;
    return this.http.put(url, data, { headers });
  }
  public submitAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}submit_task`;
    console.log(url);
    return this.http.put(url, data, { headers });
  }
  public evaluateTask(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}evaluate_task`;
    return this.http.put(url, data, { headers });
  }
  public assignAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}assign_assignment`;
    return this.http.put(url, data, { headers });
  }
  public confirmAssignment(data: object): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'json');

    const url = `${this.assignmentApiUrl}confirm_assignment`;
    return this.http.put(url, data, { headers });
  }

  public getAssignmentByIssueId(issueId: any){
    let headers = new HttpHeaders();
    const url = this.assignmentApiUrl + "my_assigned_assignments_by_issue_id/" + issueId;
    return this.http.get<any>(url, { headers });
  }


}
