import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FRONT_ROUTE_TOKEN_EMPTY, FRONT_ROUTE_TOKEN_ERROR, FRONT_ROUTE_TOKEN_NOTFOUND } from './common/config';
import { AuthGuard, SemiAuthGuard } from './common/guards';
import { MainComponent } from './components/main/main.component';
import { AppAccountSettingComponent } from './components/generic/account-setting/account-setting.component';

export const routes: Routes = [
  {
    path: FRONT_ROUTE_TOKEN_EMPTY,
    component: MainComponent,
    loadChildren: () => import('./components/core/role.routes').then((m) => m.RoleRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./components/auth/auth.routes').then(
            (m) => m.AuthRoutes
          ),
      },
      {
        path: 'account/:userCode',
        component: AppAccountSettingComponent,
        canActivate: [SemiAuthGuard],
      },
    ],
  },
  {
    path: FRONT_ROUTE_TOKEN_NOTFOUND,
    redirectTo: FRONT_ROUTE_TOKEN_ERROR,
  },
];
