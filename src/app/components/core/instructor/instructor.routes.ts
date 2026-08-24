import { Routes } from '@angular/router';
import { AppCourseListComponent } from '../student/courses/course-list/course-list.component';
import { AuthGuard } from 'src/app/common/guards';
import { AppAccountSettingComponent } from '../../generic/account-setting/account-setting.component';
import { ProfileContentComponent } from '../../generic/account/profile-content/profile-content.component';
import { AppFaqComponent } from '../../generic/faq/faq.component';
import { AppPricingComponent } from '../../generic/pricing/pricing.component';

export const InstructorRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../student/courses/course.routes').then((m) => m.CourseRoutes),
        canMatch: [AuthGuard],
      },
      {
        path: 'my-courses',
        component: AppCourseListComponent,
        data: {
          title: 'Mis cursos',
          instructorCourses: true,
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Mis cursos' },
          ],
        },
      },
      {
        path: 'profile',
        component: ProfileContentComponent,
        data: {
          title: 'Mi perfil',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Mi perfil' },
          ],
        },
      },
      {
        path: 'account',
        component: AppAccountSettingComponent,
        data: {
          title: 'Mi cuenta',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Mi cuenta' },
          ],
        },
      },
      {
        path: 'faq',
        component: AppFaqComponent,
        data: {
          title: 'Preguntas frecuentes',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Preguntas frecuentes' },
          ],
        },
      },
      {
        path: 'pricing',
        component: AppPricingComponent,
        data: {
          title: 'Precios',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Precios' },
          ],
        },
      },
    ],
  },
];
