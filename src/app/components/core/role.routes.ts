import { Routes } from '@angular/router';
import { FRONT_ROUTE_TOKEN_EMPTY, FRONT_ROUTE_TOKEN_INSTRUCTOR, FRONT_ROUTE_TOKEN_STUDENT, FRONT_ROUTE_TOKEN_SUPER } from 'src/app/common/config';
import { Roles } from 'src/app/common/enums';
import { AuthGuard, RedirectGuard, RoleGuard } from 'src/app/common/guards';

export const RoleRoutes: Routes = [
    {
    path: FRONT_ROUTE_TOKEN_EMPTY,
    pathMatch: 'full',
    canActivate: [RedirectGuard],
    children: [],
  },
/*   {
    path: FRONT_ROUTE_TOKEN_SUPER,
    data: { role: Roles.SUPER },
    loadChildren: () => import('./../pages/forms/forms.routes').then((m) => m.FormsRoutes),
    canMatch: [AuthGuard, RoleGuard],
  }, */
  {
    path: FRONT_ROUTE_TOKEN_STUDENT,
    data: { role: Roles.STUDENT },
    loadChildren: () => import('./student/student.routes').then((m) => m.StudentRoutes),
    canMatch: [AuthGuard, RoleGuard],
  },
/*   {
    path: FRONT_ROUTE_TOKEN_INSTRUCTOR,
    data: { role: Roles.INSTRUCTOR },
    loadChildren: () => import('./../pages/apps/apps.routes').then((m) => m.AppsRoutes),
    canMatch: [AuthGuard, RoleGuard],
  }, */
]