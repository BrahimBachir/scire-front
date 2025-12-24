import { createSelector } from '@ngrx/store';
import { AppState } from '../app.store';
import { AuthState } from '../../models/states';

export const selectLogin = (state: AppState) => state.auth;

export const selectVerifying = createSelector(
  selectLogin,
  (state: AuthState) => state.verifying
);

export const selectverifyingEmail = createSelector(
  selectLogin,
  (state: AuthState) => state.verifyingEmail
);

export const selectLogedIn = createSelector(
  selectLogin,
  (state: AuthState) => state.logedIn
);

export const selectSemiLogedIn = createSelector(
  selectLogin,
  (state: AuthState) => state.semiLogedIn
);

export const selectJwt = createSelector(
  selectLogin,
  (state: AuthState) => state.token
);

export const selectUserUuid = createSelector(
  selectLogin,
  (state: AuthState) => state.code
);

export const selectLogedUser = createSelector(
  selectLogin,
  (state: AuthState) => state.user
);

export const selectUserRole = createSelector(
  selectLogin,
  (state: AuthState) => state.user.role
);

export const selectUserPermits = createSelector(
  selectLogin,
  (state: AuthState) => state.user.permits
);
