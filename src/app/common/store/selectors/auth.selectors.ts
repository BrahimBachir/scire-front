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


export const selectUserPlans = createSelector(
  selectLogin,
  (state: AuthState) => state.user.user_plans
);

export const selectUserActivePlan = createSelector(
  selectLogin,
  (state: AuthState) => state.user.user_plans?.find(p => p.active)?.plan
);

export const selectUserSocialMedias = createSelector(
  selectLogin,
  (state: AuthState) => state.user.social_medias
);

export const selectVoucherExpired = createSelector(
  selectLogin,
  (state: AuthState) => state.user.voucherExpired
);

export const selectVoucherPreviousPlan = createSelector(
  selectLogin,
  (state: AuthState) => state.user.voucherPreviousPlanCode
);

export const selectPendingPlanCode = createSelector(
  selectLogin,
  (state: AuthState) => state.user.pendingPlanCode
);