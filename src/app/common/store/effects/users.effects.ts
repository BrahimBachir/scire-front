import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  deleteManyUser,
  deleteUser,
  loadAllUsers,
  manyUsersDeleted,
  userDeleted,
  usersDeletingError,
  allUsersLoaded,
  loadOneUser,
  oneUserLoaded,
  updateUser,
  createUserLogin,
  loginCompleted,
  changeUserPlan,
  resetUserPlan,
  loadLogedUser,
  startCheckout,
  checkoutSessionFailed,
} from '../actions';
import { EMPTY, of } from 'rxjs';
import { IUser } from '../../models/interfaces';
import { UsersService, PaymentsService } from 'src/app/services';
import { getDecodedAccessToken } from '../../utils';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private paymentsService: PaymentsService,
    public router: Router,
  ) {}

  loadAllUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAllUsers),
      mergeMap(({ queryingDto }) => {
        return this.usersService.getAllUsers(queryingDto).pipe(
          map((res: any) => {
            return allUsersLoaded(
              res.rows as IUser[],
              res.total as number,
            );
          },
          )
        );
      })
    );
  });

  loadOneUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOneUser),
      mergeMap(({ id }) => {
        return this.usersService.getOneUser(id).pipe(
          map((res: any) => {
            let user: IUser = res;
            return oneUserLoaded(user);
          })
        );
      })
    );
  });

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),
      concatMap(({ id }) =>
        this.usersService.deleteUser(id).pipe(
          map(() => userDeleted()),
          catchError((error) =>
            of({ type: `[User] Delete User Failed: ${error}` })
          )
        )
      )
    )
  );

  deleteManyUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteManyUser),
      concatMap(({ ids }) =>
        this.usersService.deleteManyUsers(ids).pipe(
          map(() => manyUsersDeleted()),
          catchError((error) =>
            of({ type: `[User] Delete User Failed: ${error}` })
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      concatMap(({ user }) =>
        this.usersService.updateUser(user).pipe(
          map(() => userDeleted()),
          catchError((error) =>
            of({ type: `[User] Update User Failed: ${error}` })
          )
        )
      )
    )
  );

  deleteAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(manyUsersDeleted),
      //map(() => loadAllUsers({ skip: 0, take: parseInt(this.appConfigService.getVariable(MAX_ENTITY_ITEMS)) }))
      map(() => loadAllUsers({ skip: 0, take: 10 }))
    )
  );

  changeUserPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeUserPlan),
      concatMap(({ planCode }) =>
        this.usersService.changePlan(planCode).pipe(
          map(() => loadLogedUser()),
          catchError((error) =>
            of({ type: `[User] Change Plan Failed: ${error}` })
          )
        )
      )
    )
  );

  resetUserPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetUserPlan),
      concatMap(() =>
        this.usersService.resetPlan().pipe(
          map(() => loadLogedUser()),
          catchError((error) =>
            of({ type: `[User] Reset Plan Failed: ${error}` })
          )
        )
      )
    )
  );

  // Redirects the browser to Stripe Checkout on success (the app is navigated away,
  // so there's no meaningful resulting state); dispatches checkoutSessionFailed
  // on error so the pricing page can show it.
  startCheckout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startCheckout),
      concatMap(({ planCode, interval }) =>
        this.paymentsService.createCheckoutSession(planCode, interval).pipe(
          tap(({ url }) => {
            window.location.href = url;
          }),
          map(() => ({ type: '[Payments] Checkout session created' })),
          catchError((error) => of(checkoutSessionFailed({ error })))
        )
      )
    )
  );
}