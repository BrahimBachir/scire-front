import { Routes } from '@angular/router';

import { AppErrorComponent } from './error/error.component';
import { AppForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AppLoginComponent } from './login/login.component';
import { AppRegisterComponent } from './register/register.component';
import { AppTwoStepsComponent } from './two-steps/two-steps.component';
import { FRONT_ROUTE_TOKEN_AUTH_LOGIN, FRONT_ROUTE_TOKEN_EMPTY } from 'src/app/common/config';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { SemiAuthGuard } from 'src/app/common/guards';
import { MinimumAccountComponent } from './account/min-account.component';
import { AppFaqComponent } from '../generic/faq/faq.component';

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
      }
    ],
  },
];
