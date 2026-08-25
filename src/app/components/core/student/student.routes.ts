import { Routes } from '@angular/router';
import { AppCourseListComponent } from './courses/course-list/course-list.component';
import { AuthGuard, NoOrganizationGuard } from 'src/app/common/guards';
import { AppRulesComponent } from './rules/rules.component';
import { AppTopicContentComponent } from './courses/topic-content/topic-content.component';
import { RuleFormWrapperComponent } from './rules/rule-wrapper/rule-wrapper.component';
import { AppAccountSettingComponent } from '../../generic/account-setting/account-setting.component';
import { ProfileContentComponent } from '../../generic/account/profile-content/profile-content.component';
import { AppFaqComponent } from '../../generic/faq/faq.component';
import { AppPricingComponent } from '../../generic/pricing/pricing.component';
import { AppVoucherComponent } from '../../generic/voucher/voucher.component';
import { FlashcardWrapperComponent } from './courses/common/flashcard/flashcard-wrapper.component';
import { VideoWrapperComponent } from './courses/common/video/video-wrapper.component';
import { TopicBlocksComponent } from './courses/add-course/topics/topic-blocks/topic-blocks.component';
import { DiagramFormComponent } from './courses/common/diagram/form/diagram-form.component';
import { DiagramWrapperComponent } from './courses/common/diagram/diagram-wrapper.component';


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
          myCourses: true,
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
        path: 'voucher',
        component: AppVoucherComponent,
        canActivate: [NoOrganizationGuard],
        data: {
          title: 'Código de acceso gratuito',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Código de acceso gratuito' },
          ],
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
        path: 'modules/create',
        component: RuleFormWrapperComponent,
        data: {
          title: 'Módulos',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Módulos', url: 'student/modules' },
            { title: 'Crear módulo' },
          ],
        },
      },
      {
        path: 'modules/:ruleId/edit',
        component: RuleFormWrapperComponent,
        data: {
          title: 'Módulos',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Módulos', url: 'student/modules' },
            { title: 'Editar módulo' },
          ],
        },
      },
      {
        path: 'modules/:ruleId/details',
        component: AppTopicContentComponent,
        data: {
          title: 'Módulos',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Módulos', url: 'student/modules' },
            { title: 'Ver módulo' },
          ],
        },
      },
      {
        path: 'flashcards',
        component: FlashcardWrapperComponent,
        data: {
          title: 'Flashcards',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Flashcards' },
          ],
        },
      },
      {
        path: 'videos',
        component: VideoWrapperComponent,
        data: {
          title: 'Vídeos',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Vídeos' },
          ],
        },
      },
      {
        path: 'diagrams',
        component: DiagramWrapperComponent,
        data: {
          title: 'Diagramas',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Diagramas' },
          ],
        },
      },
      {
        path: 'diagrams/create',
        component: DiagramFormComponent,
        data: {
          title: 'Crear diagrama',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Diagramas', url: 'student/diagrams' },
            { title: 'Crear' },
          ],
        },
      },
      {
        path: 'diagrams/:diagramId/edit',
        component: DiagramFormComponent,
        data: {
          title: 'Editar diagrama',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Diagramas', url: 'student/diagrams' },
            { title: 'Editar' },
          ],
        },
      },
      {
        path: 'topics/:topicId/edit',
        component: TopicBlocksComponent,
        data: {
          title: 'Tema',
          urls: [
            { title: 'Academia', url: '/' },
            { title: 'Editar tema' },
          ],
        },
      },
    ],
  },
]; 