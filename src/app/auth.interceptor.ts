import {Injectable} from '@angular/core';
import {AuthService} from "./services/auth.service";

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = this.authService.getJwtFromCookie();
    if (jwt) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization",
          "Bearer " + jwt)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(request);
    }
  }
}
