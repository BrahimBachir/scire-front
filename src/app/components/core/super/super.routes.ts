import { Routes } from '@angular/router';
import { AppModerationComponent } from './moderation/moderation.component';
import { AppOrganizationManagementComponent } from './organizations/organization-management.component';
import { AppUserManagementComponent } from './users/user-management.component';
import { AppFeedbackListComponent } from './feedback/feedback-list.component';
import { AppAccountSettingComponent } from '../../generic/account-setting/account-setting.component';
import { ProfileContentComponent } from '../../generic/account/profile-content/profile-content.component';
import { AppFaqComponent } from '../../generic/faq/faq.component';
import { AppCourseDetailComponent } from '../student/courses/course-detail/course-detail.component';
import { AppCourseTopicsComponent } from '../student/courses/course-syllabus/course-syllabus.component';
import { AppTopicContentComponent } from '../student/courses/topic-content/topic-content.component';
import { AppRulesComponent } from '../student/rules/rules.component';
import { AuthGuard } from 'src/app/common/guards';

export const SuperRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('../student/courses/course.routes').then((m) => m.CourseRoutes),
        canMatch: [AuthGuard],
      },
      {
        path: 'moderation',
        component: AppModerationComponent,
        data: {
          title: 'Moderación',
          urls: [{ title: 'Moderación' }],
        },
      },
      {
        path: 'modules',
        component: AppRulesComponent,
        data: {
          title: 'Módulos',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Módulos' },
          ],
        },
      },
      {
        path: 'courses/:courseId/details',
        component: AppCourseDetailComponent,
        data: {
          title: 'Detalles del curso',
          urls: [
            { title: 'Moderación', url: '/super/moderation' },
            { title: 'Detalles del curso' },
          ],
        },
      },
      {
        path: 'courses/:courseId/topics',
        component: AppCourseTopicsComponent,
        data: {
          title: 'Temario del curso',
          urls: [
            { title: 'Moderación', url: '/super/moderation' },
            { title: 'Temario del curso' },
          ],
        },
      },
      {
        path: 'courses/:courseId/topic/:topicId/content',
        component: AppTopicContentComponent,
        data: {
          title: 'Detalles del tema',
          urls: [
            { title: 'Moderación', url: '/super/moderation' },
            { title: 'Tema' },
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