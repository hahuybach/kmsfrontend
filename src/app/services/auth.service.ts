import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root'})
export class AuthService {
  constructor( private http:HttpClient) { }
  login(email:string, password:string){
    const userInfo = { email:email, password:password }
    const headers = new HttpHeaders().set('Content-Type', 'application/json') ;
    return this.http.post('http://localhost:8080/api/v1/auth/authenticate'
      , JSON.stringify(userInfo)
      , {headers:headers, responseType: 'text'}
    )
  }


  getJwtFromCookie(): string | null {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwtToken='));

    return cookieValue ? cookieValue.split('=')[1] : null;
  }
}
