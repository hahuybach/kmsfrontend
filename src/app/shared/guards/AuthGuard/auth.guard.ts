import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../../../services/auth.service'; // Adjust the path accordingly

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree{
    console.log(this.authService.isLoggedIn());
    return this.authService.isLoggedIn() || this.router.createUrlTree(['/login']);
  }
}
