import { Planes } from 'src/app/common/enums/planes.enum';
import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'NAV.CAPTIONS.GENERAL',
  },
  {
    displayName: 'NAV.COURSES',
    iconName: 'school',
    route: '',
    type: 'GEN',
  },
  {
    displayName: 'NAV.MY_COURSES',
    iconName: 'briefcase',
    route: 'my-courses',
    type: 'GEN',
  },
  {
    displayName: 'NAV.MODULES',
    iconName: 'hexagons',
    route: 'modules',
    type: 'GEN',
  },
  {
    navCap: 'NAV.CAPTIONS.COURSE',
  },
  {
    displayName: 'NAV.COURSE_DETAILS',
    iconName: 'file-description',
    route: 'courses/:courseId/details',
    type: 'COUR'
  },
  {
    displayName: 'NAV.SYLLABUS',
    iconName: 'book',
    route: 'courses/:courseId/topics',
    type: 'COUR'
  },
  {
    displayName: 'NAV.STATISTICS',
    iconName: 'chart-pie',
    route: 'courses/:courseId/dashboard',
    type: 'COUR',
    chip: true,
    chipClass: 'b-1 border-secondary text-secondary',
    chipContent: 'PRO',
  },
  {
    displayName: 'NAV.TESTS',
    iconName: 'devices-question',
    route: 'courses/:courseId/tests',
    type: 'COUR'
  },
  {
    displayName: 'NAV.FLASHCARDS',
    iconName: 'flip-vertical',
    route: '/flashcards',
    type: 'COUR'
  },
  {
    displayName: 'NAV.NOTES',
    iconName: 'note',
    route: 'courses/:courseId/notes',
    type: 'COUR'
  },
  {
    displayName: 'NAV.DIAGRAMS',
    iconName: 'schema',
    route: '/diagrams',
    type: 'COUR'
  },
  {
    displayName: 'NAV.VIDEOS',
    iconName: 'video',
    route: '/videos',
    type: 'COUR'
  },
  {
    displayName: 'NAV.KANBAN',
    iconName: 'checklist',
    route: 'courses/:courseId/kanban',
    type: 'COUR',
    chip: true,
    chipClass: 'b-1 border-secondary text-secondary',
    chipContent: 'PRO',
    requiresPlan: [Planes.SILVER, Planes.GOLD],
  },
  {
    displayName: 'NAV.CALENDAR',
    iconName: 'calendar',
    route: 'courses/:courseId/calendar',
    type: 'COUR',
    chip: true,
    chipClass: 'b-1 border-secondary text-secondary',
    chipContent: 'PRO',
    requiresPlan: [Planes.SILVER, Planes.GOLD],
  }
];
