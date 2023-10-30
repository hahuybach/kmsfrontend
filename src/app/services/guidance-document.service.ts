import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {FilterGuidanceDocumentResponse} from "../models/filter-guidance-document-response";

@Injectable({
  providedIn: 'root'
})
export class GuidanceDocumentService {
  private baseUrl: string = 'http://localhost:8080/api/v1/guidance/'

  constructor(private httpClient: HttpClient) {
  }

  filterGuidanceDocuments(pageNo: number = 0, pageSize: number = 5, sortBy: string = 'createdDate', sortDirection: string = 'asc',
                          guidanceDocumentName: string = '', description: string = '', startDateTime?: Date,
                          endDateTime?: Date, fullName: string = '') {
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('guidanceDocumentName', guidanceDocumentName)
      .set('description', description)
      .set('fullName', fullName)
    if (startDateTime) {
      params = params.set('startDateTime', startDateTime.toISOString());
    }

    if (endDateTime) {
      params = params.set('endDateTime', endDateTime.toISOString());
    }


    // Make the GET request
    return this.httpClient.get<any>(this.baseUrl + 'list', {params, headers});
  }

  getGuidanceDocumentById(id: number) {
    return this.httpClient.get<any>(this.baseUrl + id);
  }
}
