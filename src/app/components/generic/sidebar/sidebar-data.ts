import { Planes } from 'src/app/common/enums/planes.enum';
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
    displayName: 'Mis cursos',
    iconName: 'briefcase',
    route: 'my-courses',
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
    displayName: 'Detalles curso',
    iconName: 'file-description',
    route: 'courses/:courseId/details',
    type: 'COUR'
  },
  {
    displayName: 'Temario',
    iconName: 'book',
    route: 'courses/:courseId/topics',
    type: 'COUR'
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
    displayName: 'Tests',
    iconName: 'devices-question',
    route: 'courses/:courseId/tests',
    type: 'COUR'
  },
  {
    displayName: 'Memorización',
    iconName: 'flip-vertical',
    route: '/flashcards',
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
    route: '/diagrams',
    type: 'COUR'
  },
  {
    displayName: 'Vídeos',
    iconName: 'video',
    route: '/videos',
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
    requiresPlan: [Planes.SILVER, Planes.GOLD],
  },
  {
    displayName: 'Calendario',
    iconName: 'calendar',
    route: 'courses/:courseId/calendar',
    type: 'COUR',
    chip: true,
    chipClass: 'b-1 border-secondary text-secondary',
    chipContent: 'PRO',
    requiresPlan: [Planes.SILVER, Planes.GOLD],
  }
];
