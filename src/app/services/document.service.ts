import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  baseUrl: string = 'http://localhost:8080/api/v1/document/'

  constructor(private httpClient: HttpClient) {
  }

  checkIfDocumentCodeExist(documentCode: any) {
    let params = new HttpParams()
      .set('documentCode', documentCode.valueOf())
      .set('now',new Date().toISOString())
    ;
    console.log(params);
    console.log(documentCode);
    return this.httpClient.get<any>(this.baseUrl + 'checkIfDocumentCodeIsExist', {params})
  }
}
