import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FRONT_ROUTE_TOKEN_AUTH_URL } from '../config';
import { AppState } from '../store/app.store';
import { selectLogedIn } from '../store/selectors';

export const AuthGuard: CanMatchFn = (route, state) => {
  let router = inject(Router);
  return inject(Store<AppState>).select(selectLogedIn).subscribe({
    next: (logedIn) => {
      if(!logedIn)
        router.navigate([FRONT_ROUTE_TOKEN_AUTH_URL]);
      return logedIn;
    },
    error: (error) => console.error(error),
  }) ? true: false;
};



/* import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

// Auth Services
import { AuthService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private authFackservice: AuthfakeauthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (environment.defaultauth === 'firebase') {
      const currentUser = this.authenticationService.currentUser();
      if (currentUser) {
        // logged in so return true
        return true;
      }
    } else {
      const currentUser = this.authFackservice.currentUserValue;
      if (currentUser) {
        // logged in so return true
        return true;
      }
      // check if user data is in storage is logged in via API.
      if (localStorage.getItem('currentUser')) {
        return true;
      }
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
 */