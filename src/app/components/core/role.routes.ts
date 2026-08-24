import { Routes } from '@angular/router';
import {
  FRONT_ROUTE_TOKEN_EMPTY,
  FRONT_ROUTE_TOKEN_INSTRUCTOR,
  FRONT_ROUTE_TOKEN_STUDENT,
  FRONT_ROUTE_TOKEN_SUPER,
} from 'src/app/common/config';
import { Roles } from 'src/app/common/enums';
import { AuthGuard, RoleRedirectGuard, RoleGuard } from 'src/app/common/guards';

export const RoleRoutes: Routes = [
  {
    path: FRONT_ROUTE_TOKEN_EMPTY,
    pathMatch: 'full',
    canActivate: [RoleRedirectGuard],
    children: [],
  },
  {
    path: FRONT_ROUTE_TOKEN_SUPER,
    data: { role: Roles.SUPER },
    loadChildren: () => import('./super/super.routes').then((m) => m.SuperRoutes),
    canMatch: [AuthGuard, RoleGuard],
  },
  {
    path: FRONT_ROUTE_TOKEN_STUDENT,
    data: { role: Roles.STUDENT },
    loadChildren: () =>
      import('./student/student.routes').then((m) => m.StudentRoutes),
    canMatch: [AuthGuard, RoleGuard],
  },
  {
    path: FRONT_ROUTE_TOKEN_INSTRUCTOR,
    data: { role: Roles.INSTRUCTOR },
    loadChildren: () =>
      import('./instructor/instructor.routes').then((m) => m.InstructorRoutes),
    canMatch: [AuthGuard, RoleGuard],
  },
];
