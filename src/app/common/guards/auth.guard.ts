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
    //error: (error) => console.error(error),
  }) ? true: false;
};