import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {FilterGuidanceDocumentResponse} from "../models/filter-guidance-document-response";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GuidanceDocumentService {
  private baseUrl: string = 'http://localhost:8080/api/v1/guidance/'

  constructor(private httpClient: HttpClient) {
  }

  filterGuidanceDocuments(pageNo: number = 0, pageSize: number = 5, sortBy: string = 'createdDate', sortDirection: string = 'asc',
                          guidanceDocumentName: string = '', description: string = '', startDateTime?: string,
                          endDateTime?: string, fullName: string = '', issueId?: any, globalSearch? : any ) {
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('guidanceDocumentName', guidanceDocumentName)
      .set('description', description)
      .set('fullName', fullName)
      .set('globalSearch', globalSearch)
    if (pageNo != null && pageNo > 0) {
      pageNo = pageNo - 1;
      params = params.set('pageNo', pageNo)
    }
    if (issueId) {
      params = params.set('issueId', issueId)
    }
    if (startDateTime) {
      params = params.set('startDateTime', new Date(startDateTime.toString()).toISOString());
    }

    if (endDateTime) {
      params = params.set('endDateTime', new Date(endDateTime).toISOString());
    }
    console.log(params);

    // Make the GET request
    return this.httpClient.get<any>(this.baseUrl + 'list', {params, headers});
  }

  getGuidanceDocumentById(id: number) {
    return this.httpClient.get<any>(this.baseUrl + id);
  }
  readIssuePDF(id: string): Observable<HttpResponse<Blob>> {
    // Set the response type as 'blob' to handle binary files
    return this.httpClient.get(this.baseUrl + 'document/' + id, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  saveGuidanceDocument(request: any, files: any){
    const formData : FormData = new FormData();
    formData.append("guidance",new Blob([JSON.stringify(request)], {type:"application/json"}));
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');
    return this.httpClient.post<any>(this.baseUrl + "save", formData, { headers });
  }
}
