import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FRONT_ROUTE_TOKEN_AUTH_URL } from '../config';
import { AppState } from '../store/app.store';
import { selectSemiLogedIn } from '../store/selectors';

export const SemiAuthGuard: CanMatchFn = (route, state) => {
  let router = inject(Router);
  return inject(Store<AppState>).select(selectSemiLogedIn).subscribe({
    next: (semiLogedIn) => {
      if(!semiLogedIn)
        router.navigate([FRONT_ROUTE_TOKEN_AUTH_URL]);
      return semiLogedIn;
    },
    error: (error) => console.error(error),
  }) ? true: false;
};
