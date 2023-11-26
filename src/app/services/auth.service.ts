import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import {DomainName} from "../shared/enum/domain-name";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = DomainName.URL + "api/v1/auth/"
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const userInfo = { email: email, password: password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(
      this.baseUrl + "authenticate",
      JSON.stringify(userInfo),
      { headers: headers }
    );
  }

  logout() {
    const jwtCookie = document.cookie;
    document.cookie =
      'jwtToken=; exp=Thu, 01 Jan 1970 00:00:00 UTC; iat=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('logout');
    console.log(this.getJwtFromCookie());
  }

  isLoggedIn(): boolean {
    const jwt = this.getJwtFromCookie();
    const exp: any = this.getExpireFromCookie();
    if (jwt == null || exp == '') {
      return false;
    }
    const expireAt = JSON.parse(exp);
    return dayjs().isBefore(dayjs(expireAt * 1000));
  }

  setTokenTimeOut() {
    const iat: any = this.getIatFromCookie();
    const exp: any = this.getExpireFromCookie();
    const expireAfter = JSON.parse(exp) - JSON.parse(iat);
    setTimeout(() => this.logout(), expireAfter * 1000);
  }

  getDecodedJWT(jwt: string): any {
    try {
      return jwt_decode(jwt);
    } catch (Error) {
      return null;
    }
  }

  setJwtInCookie(jwt: string) {
    const decodedToken = this.getDecodedJWT(jwt);
    document.cookie = `exp=${decodedToken.exp}`;
    document.cookie = `iat=${decodedToken.iat}`;
    document.cookie = `sub=${decodedToken.sub}`;
    document.cookie = `jwtToken=${jwt}`;
  }

  getJwtFromCookie(): string | null {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwtToken='));

    return cookieValue ? cookieValue.split('=')[1] : null;
  }

  getExpireFromCookie(): string | null {
    const exp = document.cookie
      .split('; ')
      .find((row) => row.startsWith('exp='));
    return exp ? exp.split('=')[1] : null;
  }

  getIatFromCookie(): string | null {
    const iat = document.cookie
      .split('; ')
      .find((row) => row.startsWith('iat='));
    return iat ? iat.split('=')[1] : null;
  }
  getRoleFromJwt(): any | null {
    const jwt = this.getJwtFromCookie();
    if (jwt) {
      const decodedToken: any = this.getDecodedJWT(jwt);
      return decodedToken?.roles;
    }
    return null;
  }
  getSchoolFromJwt(): any | null {
    const jwt = this.getJwtFromCookie();
    if (jwt) {
      const decodedToken: any = this.getDecodedJWT(jwt);
      return decodedToken?.school;
    }
    return null;
  }


  getSubFromCookie(): string | null {
    const sub = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sub='));
    console.log(sub);

    return sub ? sub.split('=')[1] : null;
  }

  sendResetPasswordToken(data : any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + 'forgotPassword',JSON.stringify(data), {headers})
  }

  resetPassword(data : any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + 'checkToken',JSON.stringify(data), {headers})

  }



}
