import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DomainName} from "../shared/enum/domain-name";

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  readIssuePDF(id: string): Observable<HttpResponse<Blob>> {
    const url = DomainName.URL +  `api/v1/issue/document/${id}`; // Replace with your API endpoint
    console.log(url);
    // Set the response type as 'blob' to handle binary files
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }
  readInitiationplanPDF(id: string): Observable<HttpResponse<Blob>> {
    const url = DomainName.URL +  `api/v1/initiation_plan/view/document/${id}`; // Replace with your API endpoint
    console.log(url);
    // Set the response type as 'blob' to handle binary files
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }
  readInspectionPlanPDF(id: string): Observable<HttpResponse<Blob>> {
    const url = DomainName.URL +  `api/v1/document/view/file/${id}`; // Replace with your API endpoint
    console.log(url);
    // Set the response type as 'blob' to handle binary files
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }
  readDocumentPDFById(
    id: string,
    urlInput: string
  ): Observable<HttpResponse<Blob>> {
    const url = urlInput + '/' + id; // Replace with your API endpoint
    console.log(url);
    // Set the response type as 'blob' to handle binary files
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }
  readAssignmentPDF(id: string): Observable<HttpResponse<Blob>> {
    const url = DomainName.URL + `api/v1/assignment/view/document/${id}`; // Replace with your API endpoint
    console.log(url);
    // Set the response type as 'blob' to handle binary files
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }
  getBlob(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
