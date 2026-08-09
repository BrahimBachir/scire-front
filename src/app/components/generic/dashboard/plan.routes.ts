import { Routes } from '@angular/router';
import {
  FRONT_ROUTE_TOKEN_EMPTY,
} from 'src/app/common/config';
import { Planes } from 'src/app/common/enums';
import { AuthGuard, PlanRedirectGuard, RoleGuard } from 'src/app/common/guards';
import { AppBasicDashboardComponent } from '../basic-dashboard/basic-dashboard.component';
import { AppAdvancedDashboardComponent } from './advanced-dashboard/advanced-dashboard.component';

export const PlanRoutes: Routes = [
  {
    path: FRONT_ROUTE_TOKEN_EMPTY,
    pathMatch: 'full',
    canActivate: [PlanRedirectGuard],
    children: [],
  },
  {
    path: 'basic',
    data: {
      planes: [Planes.BRONZE],
      title: 'Estadística',
      urls: [
        { title: 'Academia', url: '/student' },
        { title: 'Curso', url: 'student/courses/:courseId/details' },
        { title: 'Estadística' },
      ],
    },
    component: AppBasicDashboardComponent,
    canMatch: [AuthGuard, RoleGuard],
  },
  {
    path: 'advanced',
    data: {
      planes: [Planes.SILVER, Planes.GOLD],
      title: 'Estadística',
      urls: [
        { title: 'Academia', url: '/student' },
        { title: 'Curso', url: 'student/courses/:courseId/details' },
        { title: 'Estadística' },
      ],
    },
    component: AppAdvancedDashboardComponent,
    canMatch: [AuthGuard, RoleGuard],
  },
];
