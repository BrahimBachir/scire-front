import { Routes } from '@angular/router';
import { AppCourseModerationComponent } from './moderation/course-moderation.component';

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
    ],
  },
];