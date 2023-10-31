import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenExpirationInterceptor implements HttpInterceptor {
  constructor(private readonly router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 4000) {
          const customError = new Error('Token has expired');
          // Include the error message in the route parameters
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
