import { Planes } from 'src/app/common/enums/planes.enum';
import { Roles } from 'src/app/common/enums/roles.enum';
import { NavItem } from './nav-item/nav-item';

const NON_SUPER_ROLES = [Roles.STUDENT, Roles.INSTRUCTOR];

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
    roles: NON_SUPER_ROLES,
  },
  {
    displayName: 'NAV.MODULES',
    iconName: 'hexagons',
    route: 'modules',
    type: 'GEN',
  },
  {
    displayName: 'NAV.ORGANIZATIONS',
    iconName: 'building-community',
    route: 'organizations',
    type: 'GEN',
    roles: [Roles.SUPER],
  },
  {
    displayName: 'NAV.USERS',
    iconName: 'users-group',
    route: 'users',
    type: 'GEN',
    roles: [Roles.SUPER],
  },
  {
    displayName: 'NAV.MODERATION',
    iconName: 'gavel',
    route: 'moderation',
    type: 'GEN',
    roles: [Roles.SUPER],
  },
  {
    navCap: 'NAV.CAPTIONS.COURSE',
    roles: NON_SUPER_ROLES,
  },
  {
    displayName: 'NAV.COURSE_DETAILS',
    iconName: 'file-description',
    route: 'courses/:courseId/details',
    type: 'COUR',
    roles: NON_SUPER_ROLES,
  },
  {
    displayName: 'NAV.SYLLABUS',
    iconName: 'book',
    route: 'courses/:courseId/topics',
    type: 'COUR',
    roles: NON_SUPER_ROLES,
  },
  {
    displayName: 'NAV.STATISTICS',
    iconName: 'chart-pie',
    route: 'courses/:courseId/dashboard',
    type: 'COUR',
    chip: true,
    chipClass: 'b-1 border-secondary text-secondary',
    chipContent: 'PRO',
    roles: NON_SUPER_ROLES,
  },
  {
    displayName: 'NAV.TESTS',
    iconName: 'devices-question',
    route: 'courses/:courseId/tests',
    type: 'COUR',
    roles: NON_SUPER_ROLES,
  },
  {
    displayName: 'NAV.FLASHCARDS',
    iconName: 'flip-vertical',
    route: '/flashcards',
    type: 'COUR',
    roles: NON_SUPER_ROLES,
  },
  {
    displayName: 'NAV.NOTES',
    iconName: 'note',
    route: 'courses/:courseId/notes',
    type: 'COUR',
    roles: NON_SUPER_ROLES,
  },
  {
    displayName: 'NAV.DIAGRAMS',
    iconName: 'schema',
    route: '/diagrams',
    type: 'COUR',
    roles: NON_SUPER_ROLES,
  },
  {
    displayName: 'NAV.VIDEOS',
    iconName: 'video',
    route: '/videos',
    type: 'COUR',
    roles: NON_SUPER_ROLES,
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
    roles: NON_SUPER_ROLES,
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
    roles: NON_SUPER_ROLES,
  }
];
