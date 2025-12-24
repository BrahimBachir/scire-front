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
} from '../actions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';
import { FRONT_ROUTE_TOKEN_AUTH_URL } from '../../config';
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
          map(res => {
            const data_parsed = Object.create(res);
            let detokenized = getDecodedAccessToken(data_parsed.token);
            console.log("User from the back: ",detokenized)
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
        exhaustMap((action) => this.authService.createUserLogin(action.user)
        .pipe(
          map(res => {
            console.log("Response: ", res);
            const user = res as IUser & { token: string };
            console.log("Response: ", user);
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
            console.log("Response: ", res);
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
      map(() => {
        this.router.navigate([FRONT_ROUTE_TOKEN_AUTH_URL]);
        return endLogoutAction();
      })
    )
  });

    /* loadSelectedCourse$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(logedUserLoaded),
          concatMap(({ course }) =>
            from(this.router.navigate([`student/courses/${course.id}/details`])).pipe(
              catchError((error) => {
                console.error('[LEARNING] Error:', error); 
                return EMPTY;
              })
            )
          )
        ),
      { dispatch: false }
    ); */
}