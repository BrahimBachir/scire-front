import { Routes } from '@angular/router';
import { AppNotesComponent } from '../../notes/notes.component';
import { AppCourseDetailComponent } from './course-detail/course-detail.component';
import { AppCourseListComponent } from './course-list/course-list.component';
import { AppTopicContentComponent } from './topic-content/topic-content.component';
import { AppKanbanComponent } from '../../kanban/kanban.component';
import { AppFullcalendarComponent } from '../../fullcalendar/fullcalendar.component';
import { AppTestComponent } from '../test/test.component';
import { AppDashboardComponent } from 'src/app/components/generic/dashboard/dashboard.component';
import { FlashcardWrapperComponent } from './common/flashcard/flashcard-wrapper.component';
import { VideoWrapperComponent } from './common/video/video-wrapper.component';
import { SchemeWrapperComponent } from './common/scheme/scheme-wrapper.component';
import { SchemeFormComponent } from './common/scheme/form/scheme-form.component';
import { AppCourseTopicsComponent } from './course-topics/course-topics.component';
import { AddCourseComponent } from './add-course/add-course.component';


export const CourseRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppCourseListComponent,
        data: {
          title: 'Academia',
          urls: [
            { title: 'Academia' },
          ],
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
        }
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
        }
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
        }
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
        data: {
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
        data: {
          title: 'Calendario',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Curso', url: 'student/courses/:courseId/details' },
            { title: 'Calendario' },
          ],
        },
      },
      {
        path: 'courses/:courseId/dashboard',
        component: AppDashboardComponent,
        data: {
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
        path: 'courses/new',
        component: AddCourseComponent,
        data: {
          title: 'Nuevo curso',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Crear' },
          ],
        },
      },
      {
        path: 'courses/:courseId/edit',
        component: AddCourseComponent,
        data: {
          title: 'Editar curso',
          urls: [
            { title: 'Academia', url: '/student' },
            { title: 'Editar' },
          ],
        },
      },
    ],
  },
]; 