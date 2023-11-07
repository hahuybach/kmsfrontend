import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl: string = 'http://localhost:8080/api/v1/user/'

  constructor(private httpClient: HttpClient) {
  }

  isUnique(email: string) {
    const request = {
      email
    };
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.post<any>( this.baseUrl + 'isEmailUnique', JSON.stringify(request), { headers });
  }

}
