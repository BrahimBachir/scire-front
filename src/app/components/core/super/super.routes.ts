import { Routes } from '@angular/router';
import { AppCourseModerationComponent } from './moderation/course-moderation.component';
import { AppOrganizationManagementComponent } from './organizations/organization-management.component';
import { AppUserManagementComponent } from './users/user-management.component';
import { AppFeedbackListComponent } from './feedback/feedback-list.component';

export const SuperRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'moderation',
      },
      {
        path: 'moderation',
        component: AppCourseModerationComponent,
        data: {
          title: 'Moderación',
          urls: [{ title: 'Moderación' }],
        },
      },
      {
        path: 'organizations',
        component: AppOrganizationManagementComponent,
        data: {
          title: 'Organizaciones',
          urls: [{ title: 'Organizaciones' }],
        },
      },
      {
        path: 'users',
        component: AppUserManagementComponent,
        data: {
          title: 'Usuarios',
          urls: [{ title: 'Usuarios' }],
        },
      },
      {
        path: 'feedback',
        component: AppFeedbackListComponent,
        data: {
          title: 'Feedback',
          urls: [{ title: 'Feedback' }],
        },
      },
    ],
  },
];