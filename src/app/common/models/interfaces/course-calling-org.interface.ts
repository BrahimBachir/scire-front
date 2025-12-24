import { ICourse } from '.';

export interface ICallingOrg {
  id: number; // ID del examen
  code: string; // Código del curso
  description: string; // Descripción del curso
  courses?: ICourse[]; // Cursos relacionados
  icon: string; // Icono representativo
}

export interface IIncomingCallingOrgs {
    total: number;
    rows: ICallingOrg[];
}

