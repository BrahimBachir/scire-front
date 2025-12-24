import { createAction, props } from '@ngrx/store';
import { ILogin, IUser } from '../../models/interfaces';

export const LOGIN_SUBMIT = '[USER - Login] Submit Login';
export const VERIFIIYING_EMAIL = '[USER - Login] Email verification started';
export const LOGIN_COMPLETED = '[USER - Login] User loged in successfully!';
export const EMAIL_VERIFICATION_CODE_SENT = '[USER - Login] Email verification completed successfully!';
export const VERIFICATION_COMPLETED = '[USER - Login] Email verification code sent!';
export const LOAD_LOGED_USER = '[USER - Login] Load loged user';
export const LOGED_USER_LOADED =
  '[USER - Login] Loged user loaded successfully!';
export const START_LOGOUT = '[USER - Logout] User to be logedout!';
export const LOGOUT_FINISHED = '[USER - Logout] Logout successfully!';
export const LOGIN_ERROR = '[USER - Login] An error has occured!';
export const CREATE_USER_LOGIN = '[USER - Login] Create user-login';

export const verifiyingEmail = createAction(VERIFIIYING_EMAIL);
export const emailVerificantionCodeSent = createAction(EMAIL_VERIFICATION_CODE_SENT);
export const createUserLogin = createAction(CREATE_USER_LOGIN, props<{ user: IUser }>());

export const submitLogin = createAction(LOGIN_SUBMIT, (login: ILogin) => ({
  login,
}));

export const verificationCompleted = createAction(
  VERIFICATION_COMPLETED,
  (
    token: string,
    code: string,
  ) => ({ token, code})
);


export const loginCompleted = createAction(
  LOGIN_COMPLETED,
  (
    token: string,
    code: string,
  ) => ({ token, code})
);

export const loadLogedUser = createAction(LOAD_LOGED_USER);

export const logedUserLoaded = createAction(
  LOGED_USER_LOADED,
  (user: IUser, token: string) => ({ user, token })
);

export const logoutAction = createAction(START_LOGOUT);
export const endLogoutAction = createAction(LOGOUT_FINISHED);
export const loginError = createAction(LOGIN_ERROR, (error: any) => ({error}));
