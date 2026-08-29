import { Routes } from '@angular/router';

import { AppErrorComponent } from './error/error.component';
import { AppForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AppLoginComponent } from './login/login.component';
import { AppRegisterComponent } from './register/register.component';
import { AppTwoStepsComponent } from './two-steps/two-steps.component';
import { FRONT_ROUTE_TOKEN_AUTH_PASS_CHANGE, FRONT_ROUTE_TOKEN_AUTH_PASS_RESET, FRONT_ROUTE_TOKEN_AUTH_TWO_FACTOR, FRONT_ROUTE_TOKEN_EMPTY } from 'src/app/common/config';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { SemiAuthGuard } from 'src/app/common/guards';
import { MinimumAccountComponent } from './account/min-account.component';
import { AppFaqComponent } from '../generic/faq/faq.component';
import { AppMandatoryPasswordChangeComponent } from './mandatory-password-change/mandatory-password-change.component';
import { AppResetPasswordComponent } from './reset-password/reset-password.component';
import { AppTwoFactorVerifyComponent } from './two-factor-verify/two-factor-verify.component';

export const AuthRoutes: Routes = [
  {
    path: FRONT_ROUTE_TOKEN_EMPTY,
    children: [
      {
        path: 'error',
        component: AppErrorComponent,
      },
      {
        path: 'forgot-pwd',
        component: AppForgotPasswordComponent,
      },
      {
        path: FRONT_ROUTE_TOKEN_AUTH_PASS_CHANGE,
        component: AppMandatoryPasswordChangeComponent,
      },
      {
        path: FRONT_ROUTE_TOKEN_AUTH_PASS_RESET,
        component: AppResetPasswordComponent,
      },
      {
        path: FRONT_ROUTE_TOKEN_AUTH_TWO_FACTOR,
        component: AppTwoFactorVerifyComponent,
      },
      {
        path: '',
        component: AppLoginComponent,
      },
      {
        path: 'register',
        component: AppRegisterComponent,
      },
      {
        path: 'two-steps/:code',
        component: AppTwoStepsComponent,
      },
      {
        path: 'email-verification/:code',
        component: EmailVerificationComponent,
      },
      {
        path: 'privacy',
        component: AppFaqComponent,
      },
      {
        path: 'terms',
        component: AppFaqComponent,
      },
      {
        path: 'profile/:code',
        component: MinimumAccountComponent,
        canActivate: [SemiAuthGuard],
      },
    ],
  },
];
