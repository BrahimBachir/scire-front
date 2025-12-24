import { ICourseType, ITopic, ICallingOrg } from '.';

export interface ICourse {
  id: number; // ID del examen
  code: string; // Código del curso
  description: string; // Descripción del curso
  calling_org?: ICallingOrg;
  calling_year: string;
  examDate?: Date;
  type?: ICourseType;
  topics?: ITopic[];
  vacancies: number;
  imgSrc?: string;
  rating?: number;
  colour?: string;
}

export interface IIncomingCourses {
    total: number;
    rows: ICourse[];
}

