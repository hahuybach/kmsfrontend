import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {DomainName} from "../shared/enum/domain-name";

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  baseUrl: string = DomainName.URL +  'api/v1/document/';

  constructor(private httpClient: HttpClient) {}

  checkIfDocumentCodeExist(documentCode: any) {
    let params = new HttpParams()
      .set('documentCode', documentCode.valueOf())
      .set('now', new Date().toISOString());
    console.log(params);
    console.log(documentCode);
    return this.httpClient.get<any>(
      this.baseUrl + 'checkIfDocumentCodeIsExist',
      { params }
    );
  }
  public filterTreeTask(
    pageNo: number = 0,
    pageSize: number = 5,
    sortBy: string = 'School.schoolName',
    sortDirection: string = 'asc',
    assignmentName: string = '',
    status?: any,
    issue?: any,
    school?: any
  ) {
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('assignmentName', assignmentName);
    if (pageNo != null && pageNo > 0) {
      pageNo = pageNo - 1;
      params = params.set('pageNo', pageNo);
    }
    if (issue) {
      params = params.set('issueId', issue.issueId);
    }
    if (status) {
      params = params.set('statusId', status);
    }
    if (school) {
      params = params.set('schoolId', school);
    }

    console.log(params);

    // Make the GET request
    return this.httpClient.get<any>(this.baseUrl + 'list/task_tree_list', {
      params,
      headers,
    });
  }
  public getAssignmentsBySchoolId(issueId: number, schoolId: number) {
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('issueId', issueId)
      .set('schoolId', schoolId);

    return this.httpClient.get<any[]>(
      this.baseUrl + 'get_assignment_by_school_id',
      { params, headers }
    );
  }

  public filterAsm(
    pageNo: number = 0,
    pageSize: number = 5,
    sortBy: string = 'School.schoolName',
    sortDirection: string = 'asc',
    assignmentName: string = '',
    status?: any,
    issue?: any,
    school?: any,
    isTask: boolean = false
  ) {
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('assignmentName', assignmentName)
      .set('isTask', false)
    ;
    if (pageNo != null && pageNo > 0) {
      pageNo = pageNo - 1;
      params = params.set('pageNo', pageNo);
    }
    if (issue) {
      params = params.set('issueId', issue.issueId);
    }
    if (status) {
      params = params.set('statusId', status);
    }
    if (school) {
      params = params.set('schoolId', school);
    }

    console.log(params);

    // Make the GET request
    return this.httpClient.get<any>(this.baseUrl + 'filterTask', {
      params,
      headers,
    });
  }

}
