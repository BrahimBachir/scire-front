import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { FRONT_ROUTE_TOKEN_EMPTY } from '../config';
import { AppState } from '../store/app.store';
import { selectUserRole } from '../store/selectors';
import { Store } from '@ngrx/store';

export const RoleGuard: CanMatchFn = (route, state) => {
  let router = inject(Router);
  return inject(Store<AppState>).select(selectUserRole).subscribe({
    next: (role) => {
      if(!(role && role.code === route.data?.['role']))
        router.navigate([FRONT_ROUTE_TOKEN_EMPTY]);
      return role.code === route.data?.['role'];
    },
    error: (error) => console.error(error),
  }) ? true: false;
};