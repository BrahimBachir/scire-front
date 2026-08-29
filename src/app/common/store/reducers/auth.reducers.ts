import { createReducer, on } from '@ngrx/store';
import { submitLogin, loginCompleted, logedUserLoaded, logoutAction, verificationCompleted, verifiyingEmail, emailVerificantionCodeSent, mandatoryPasswordChangeRequired, twoFactorRequired } from '../actions';
import { InitialAuthState } from '../../models/states';

export const authReducer = createReducer(
  InitialAuthState,
  on(submitLogin, (state) => {
    return {
      ...state,
      verifying: true,
    };
  }),
  on(verifiyingEmail, (state) => {
    return {
      ...state,
      verifyingEmail: true,
    };
  }),
  on(emailVerificantionCodeSent, (state) => {
    return {
      ...state,
      verifyingEmail: false,
      verifying: false,
    };
  }),
  on(
    loginCompleted,
    (state, { token, code }) => {
      return {
        ...state,
        verifying: false,
        verifyingEmail: false,
        token: token,
        code: code,
      };
    }
  ),
  on(
    verificationCompleted,
    (state, { token, code }) => {
      return {
        ...state,
        token: token,
        code: code,
        semiLogedIn: true,
      };
    }
  ),
  on(logedUserLoaded, (state, { user, token }) => {
    return {
      ...state,
      verifying: false,
      user: user,
      token: token,
      logedIn: true,
    };
  }),
  on(mandatoryPasswordChangeRequired, (state) => {
    return {
      ...state,
      verifying: false,
    };
  }),
  on(twoFactorRequired, (state) => {
    return {
      ...state,
      verifying: false,
    };
  }),
  on(logoutAction, (state) =>{
    return {
      ...state,
      logedIn: false
    }
  })
);
