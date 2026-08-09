import { Routes } from '@angular/router';
import { AppNotesComponent } from '../../notes/notes.component';
import { AppCourseDetailComponent } from './course-detail/course-detail.component';
import { AppCourseListComponent } from './course-list/course-list.component';
import { AppTopicContentComponent } from './topic-content/topic-content.component';
import { AppKanbanComponent } from '../../kanban/kanban.component';
import { AppFullcalendarComponent } from '../../fullcalendar/fullcalendar.component';
import { AppTestComponent } from '../test/test.component';
import { AppCourseTopicsComponent } from './course-syllabus/course-syllabus.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { ProfileContentComponent } from 'src/app/components/generic/account/profile-content/profile-content.component';
import { AppTestSimulatorComponent } from '../test/simulator/simulator.component';
import { AppTestResultsComponent } from '../test/test-results/test-results.component';
import { PlanGuard } from 'src/app/common/guards/plan-auth.guard';
import { AppAdvancedDashboardComponent } from 'src/app/components/generic/dashboard/advanced-dashboard/advanced-dashboard.component';
import { Planes } from 'src/app/common/enums';
import { AppBasicDashboardComponent } from 'src/app/components/generic/dashboard/basic-dashboard/basic-dashboard.component';

export const CourseRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppCourseListComponent,
        data: {
          title: 'Academia',
          urls: [{ title: 'Academia' }],
        },
      },
      {
        path: 'courses/:courseId/details',
        component: AppCourseDetailComponent,
        data: {
          title: 'Detalles del curse',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Detalle del curso' },
          ],
        },
      },
      {
        path: 'courses/:courseId/contributors/:userId',
        component: ProfileContentComponent,
        data: {
          title: 'Perfil',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Perfil del usuario' },
          ],
        },
      },
      {
        path: 'courses/:courseId/topics',
        component: AppCourseTopicsComponent,
        data: {
          title: 'Temas del curse',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Temas del curso' },
          ],
        },
      },
      {
        path: 'courses/:courseId/topic/:topicId/content',
        component: AppTopicContentComponent,
        data: {
          title: 'Detalles del tema',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Tema' },
          ],
        },
      },
      {
        path: 'courses/:courseId/notes',
        component: AppNotesComponent,
        data: {
          title: 'Notas',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Notas' },
          ],
        },
      },
      {
        path: 'courses/:courseId/kanban',
        component: AppKanbanComponent,
        canActivate: [PlanGuard],
        data: {
          planes: [Planes.SILVER, Planes.GOLD],
          title: 'Kanban',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Kanban' },
          ],
        },
      },
      {
        path: 'courses/:courseId/calendar',
        component: AppFullcalendarComponent,
        canActivate: [PlanGuard],
        data: {
          planes: [Planes.SILVER, Planes.GOLD],
          title: 'Calendario',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Calendario' },
          ],
        },
      },
      {
        path: 'courses/:courseId/dashboard/basic',
        component: AppBasicDashboardComponent,
        canActivate: [PlanGuard],
        data: {
          planes: [Planes.BRONZE],
          title: 'Estadística',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Estadística' },
          ],
        },
      },
      {
        path: 'courses/:courseId/dashboard/advanced',
        component: AppAdvancedDashboardComponent,
        canActivate: [PlanGuard],
        data: {
          planes: [Planes.SILVER, Planes.GOLD],
          title: 'Estadística',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Estadística' },
          ],
        },
      },
      {
        path: 'courses/:courseId/tests',
        component: AppTestComponent,
        data: {
          title: 'Tests',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Tests' },
          ],
        },
      },
      {
        path: 'courses/:courseId/tests/:testId/simulator',
        component: AppTestSimulatorComponent,
        data: {
          title: 'Simulador',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Tests', url: 'student/courses/:courseId/tests' },
            { title: 'Simulador' },
          ],
        },
      },
      {
        path: 'courses/:courseId/tests/:testId/results',
        component: AppTestResultsComponent,
        data: {
          title: 'Resultados del test',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Tests', url: 'student/courses/:courseId/tests' },
            { title: 'Resultados' },
          ],
        },
      },
      {
        path: 'courses/new',
        component: AddCourseComponent,
        data: {
          title: 'Nuevo curso',
          urls: [{ title: 'Academia', url: '/student' }, { title: 'Crear' }],
        },
      },
      {
        path: 'courses/:courseId/edit',
        component: AddCourseComponent,
        data: {
          title: 'Editar curso',
          urls: [{ title: 'Academia', url: '/student' }, { title: 'Editar' }],
        },
      },
    ],
  },
];
