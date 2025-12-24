import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Roles } from '../enums';
import {
  FRONT_ROUTE_TOKEN_SUPER,
  FRONT_ROUTE_TOKEN_STUDENT,
  FRONT_ROUTE_TOKEN_INSTRUCTOR,
} from '../config';
import { AppState } from '../store/app.store';
import { selectUserRole } from '../store/selectors';

export const RedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let destination = '/auth';
  let valid = false;

  return inject(Store<AppState>)
    .select(selectUserRole)
    .subscribe({
      next: (role) => {
        if (role.code === Roles.SUPER) {
          destination = state.url + FRONT_ROUTE_TOKEN_SUPER;
          valid = true;
        } else if (role.code === Roles.STUDENT) {
          destination = state.url + FRONT_ROUTE_TOKEN_STUDENT;
          valid = true;
        }else if (role.code === Roles.INSTRUCTOR) {
          destination = state.url + FRONT_ROUTE_TOKEN_INSTRUCTOR;
          valid = true;
        } else {
          return valid;
        }
        router.navigate([destination]);
        return valid;
      },
      error: (error) => console.error(error),
    })
    ? true
    : false;
};

/* import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.store';
import { selectUserRole } from 'src/app/store/selectors';
import { Profiles } from '../enums';
import {
  FRONT_ROUTE_TOKEN_USER,
  FRONT_ROUTE_TOKEN_CLINICAL,
  FRONT_ROUTE_TOKEN_SUPER,
  FRONT_ROUTE_TOKEN_LOGISTICS,
} from '../config';

export const RedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let destination = '/auth';
  let valid = false;

  return inject(Store<AppState>)
    .select(selectUserRole)
    .subscribe({
      next: (role) => {
        if (role.code === Profiles.SUPER) {
          destination = state.url + FRONT_ROUTE_TOKEN_SUPER;
          valid = true;
        } else if (role.code === Profiles.ADMIN) {
          destination = state.url + FRONT_ROUTE_TOKEN_USER;
          valid = true;
        } else if (role.code === Profiles.USER) {
          destination = state.url + FRONT_ROUTE_TOKEN_LOGISTICS;
          valid = true;
        } else if (role.code === Profiles.CUSTOMER) {
          destination = state.url + FRONT_ROUTE_TOKEN_CLINICAL;
          valid = true;
        }
        router.navigate([destination]);
        return valid;
      },
      error: (error) => console.error(error),
    })
    ? true
    : false;
    }; */

/* 
const router = inject(Router);
  const store = inject(Store<AppState>);
  store.select(selectUserRole).subscribe({
    next: (role) =>{
      if (role) {
        router.navigate(['/'+ role.code.toLowerCase()]);
        return true;
      }
      router.navigate(['auth'], { queryParams: { returnUrl: state.url }});
      return false;
    },
    error: (error) => console.error(error),
  });
  return false;
----------------------------------------------------
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuardService implements CanActivate {
  constructor(
      private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role =  localStorage.getItem('login.role');//this.authService.userVal;
    if (role) {      
      this.router.navigate(['/'+ role]);
      return true;      
    }      
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}


  /*


  // From: https://stackoverflow.com/questions/57357145/redirectto-lazy-module-based-on-user-role
    constructor(
      private router: Router,
      private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.userVal;
    if (user) {      
      this.router.navigate(['/'+ user.role]);
      return true;      
    }      
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }


  export class RoleRedirectGuard implements CanActivate {
  constructor(
      private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    const role =  localStorage.getItem('login.role');
    if (role) {      
      this.router.navigate(['/'+ role]);
      return true;      
    }    
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
  */
