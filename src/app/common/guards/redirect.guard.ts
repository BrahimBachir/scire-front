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
      //error: (error) => console.error(error),
    })
    ? true
    : false;
};
