import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'General',
  },
  {
    displayName: 'Cursos',
    iconName: 'school',
    route: '',
    type: 'GEN',
  },
  {
    displayName: 'Módulos',
    iconName: 'hexagons',
    route: 'modules',
    type: 'GEN',
  },
  {
    navCap: 'Curso',
  },
  {
    displayName: 'Estadísticas',
    iconName: 'chart-pie',
    route: 'courses/:courseId/dashboard',
    type: 'COUR',
    chip: true,
    chipClass: 'b-1 border-secondary text-secondary',
    chipContent: 'PRO',
  },
  {
    displayName: 'Temario',
    iconName: 'book',
    route: 'courses/:courseId/details',
    type: 'COUR'
  },
  {
    displayName: 'Tests',
    iconName: 'devices-question',
    route: 'courses/:courseId/tests',
    type: 'COUR'
  },
  {
    displayName: 'Memorización',
    iconName: 'flip-vertical',
    route: 'courses/:courseId/flashcards',
    type: 'COUR'
  },
  {
    displayName: 'Notas',
    iconName: 'note',
    route: 'courses/:courseId/notes',
    type: 'COUR'
  },
  {
    displayName: 'Diagramas',
    iconName: 'schema',
    route: 'courses/:courseId/schemes',
    type: 'COUR'
  },
  {
    displayName: 'Vídeos',
    iconName: 'video',
    route: 'courses/:courseId/videos',
    type: 'COUR'
  },
  {
    displayName: 'Kanban',
    iconName: 'checklist',
    route: 'courses/:courseId/kanban',
    type: 'COUR',
    chip: true,
    chipClass: 'b-1 border-secondary text-secondary',
    chipContent: 'PRO',
  },
  {
    displayName: 'Calendario',
    iconName: 'calendar',
    route: 'courses/:courseId/calendar',
    type: 'COUR',
    chip: true,
    chipClass: 'b-1 border-secondary text-secondary',
    chipContent: 'PRO',
  }
];
