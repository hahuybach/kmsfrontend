import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root'})
export class AuthService {
  constructor( private _http:HttpClient) { }
  login(username:string='', password:string=''){
    const userInfo = { un:username, pw:password }
    const headers = new HttpHeaders().set('Content-Type', 'application/json') ;
    return this._http.post('localhost:8080/api/v1/auth/authenticate'
      , JSON.stringify(userInfo)
      , {headers:headers, responseType: 'text'}
    )
  }
}
