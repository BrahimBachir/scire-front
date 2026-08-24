import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap,  map } from 'rxjs/operators';
import {
  loginCompleted,
  submitLogin,
  logedUserLoaded,
  LOGIN_ERROR,
  endLogoutAction,
  logoutAction,
  createUserLogin,
  loadLogedUser,
  mandatoryPasswordChangeRequired,
} from '../actions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';
import { FRONT_ROUTE_TOKEN_AUTH_URL, FRONT_ROUTE_TOKEN_AUTH_PASS_CHANGE } from '../../config';
import { IUser } from '../../models/interfaces';
import { getDecodedAccessToken } from '../../utils';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router =  inject(Router);

  submitLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(submitLogin),
        exhaustMap((action) => this.authService.login(action.login)
        .pipe(
          //map(logingInfo => ({ type: loginCompleted, payload: logingInfo })),
          map((res: any) => {
            if (res?.mustChangePassword) {
              this.authService.setChangeToken(res.changeToken);
              this.router.navigate([FRONT_ROUTE_TOKEN_AUTH_URL, FRONT_ROUTE_TOKEN_AUTH_PASS_CHANGE]);
              return mandatoryPasswordChangeRequired();
            }
            const data_parsed = Object.create(res);
            let detokenized = getDecodedAccessToken(data_parsed.token);
            return loginCompleted(data_parsed.token,detokenized.sub);
          }),
          catchError( () => {
            return of(logoutAction());
          })
        )
      )
    )
  });

  createLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createUserLogin),
        exhaustMap((action) => this.authService.createUserLogin(action.user, action.planCode)
        .pipe(
          map(res => {
            const user = res as IUser & { token: string };
            return logedUserLoaded(user, user.token);
          }),
          catchError(() => of({ type: LOGIN_ERROR }))
        )
      )
    )
  });

  userLogedIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginCompleted),
      exhaustMap(() => this.authService.getLogedUser()
        .pipe(
          //map(logingInfo => ({ type: loginCompleted, payload: logingInfo })),
          map(res => {
            const user = res as IUser & { token: string };
            return logedUserLoaded(user, user.token);
          }),
          catchError(() => of({ type: LOGIN_ERROR }))
        )
      )
    )
  });

  loadLogedUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadLogedUser),
      exhaustMap(() => this.authService.getLogedUser()
        .pipe(
          map(res => {
            const user = res as IUser & { token: string };
            return logedUserLoaded(user, user.token);
          }),
          catchError(() => of({ type: LOGIN_ERROR }))
        )
      )
    )
  });

  logoutUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logoutAction),
      exhaustMap(() =>
        this.authService.logout().pipe(
          // Best-effort: local logout must proceed even if the API call fails
          // (e.g. the refresh token was already expired/revoked).
          catchError(() => of(null)),
          map(() => {
            this.router.navigate([FRONT_ROUTE_TOKEN_AUTH_URL]);
            return endLogoutAction();
          }),
        )
      )
    )
  });
}