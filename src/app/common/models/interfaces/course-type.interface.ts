import { ICourse } from '.';

export interface ICourseType {
  id: number; // ID del examen
  code: string; // Código del curso
  description: string; // Descripción del curso
  courses?: ICourse[]; // Cursos relacionados
}

export interface IIncomingCoursesTypes {
    total: number;
    rows: ICourseType[];
}

