import { Routes } from '@angular/router';
import { AppCourseListComponent } from './courses/course-list/course-list.component';
import { AuthGuard } from 'src/app/common/guards';
import { AppRulesComponent } from './rules/rules.component';
import { AppTopicContentComponent } from './courses/topic-content/topic-content.component';
import { AppCreateEditRuleComponent } from './rules/create-edit/create-edit-rule.component';
import { AppAccountSettingComponent } from '../../generic/account-setting/account-setting.component';
import { ProfileContentComponent } from '../../generic/account/profile-content/profile-content.component';
import { AppFaqComponent } from '../../generic/faq/faq.component';
import { AppPricingComponent } from '../../generic/pricing/pricing.component';


export const StudentRoutes: Routes = [
  {
    path: '',
    //redirectTo: 'courses',
    children: [
      {
        path: '',
        loadChildren: () => import('./courses/course.routes').then((m) => m.CourseRoutes),
        canMatch: [AuthGuard],
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
        path: 'my-courses',
        component: AppCourseListComponent,
        data: {
          title: 'Mis cursos',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Mis cursos' },
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
      {
        path: 'modules',
        component: AppRulesComponent,
        data: {
          title: 'Normas',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Normas' },
          ],
        },
      },
      {
        path: 'modules/create',
        component: AppCreateEditRuleComponent,
        data: {
          title: 'Normas',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Normas' },
          ],
        },
      },
      {
        path: 'modules/:ruleCode/edit',
        component: AppCreateEditRuleComponent,
        data: {
          title: 'Normas',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Normas' },
          ],
        },
      },
      {
        path: 'modules/:ruleCode/details',
        component: AppTopicContentComponent,
        data: {
          title: 'Normas',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Normas' },
          ],
        },
      },
    ],
  },
]; 