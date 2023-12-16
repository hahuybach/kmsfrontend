import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {AuthService} from "../../../services/auth.service";

@Injectable()
export class TokenExpirationInterceptor implements HttpInterceptor {
  constructor(private readonly router: Router,
  private readonly authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.error.message === "Hết thời hạn đăng nhập") {
          const customError = new Error('Token has expired');
          this.authService.logout();
          this.router.navigate(['/login'], {
            queryParams: { error: customError.message },
          });
          return throwError(customError);
        }
        return throwError(error);
      })
    );
  }
}
