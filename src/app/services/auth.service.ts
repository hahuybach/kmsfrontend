import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs'

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    const userInfo = {email: email, password: password}
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/api/v1/auth/authenticate'
      , JSON.stringify(userInfo)
      , {headers: headers, responseType: 'text'}
    )
  }

  logout() {
    const jwtCookie = document.cookie;
    document.cookie = "jwtToken=; exp=Thu, 01 Jan 1970 00:00:00 UTC; iat=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("logout")
    console.log(this.getJwtFromCookie())
  }

  isLoggedIn(): boolean {
    const jwt = this.getJwtFromCookie();
    const exp: any = this.getExpireFromCookie();
    if (jwt == null || exp == "") {
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

  getSubFromCookie(): string | null{
    const sub = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sub='));
    return sub ? sub.split('=')[1] : null;
  }
}
