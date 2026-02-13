import { FilterConfig } from "../../models/interfaces";

export const CourseFiltersData: FilterConfig[] = [ 
  {
    key: 'search',
    kind: 'searchTerm',
    label: 'Buscar',
    minLength: 3
  },
  {
    key: 'caller',
    kind: 'callerId',
    label: 'Convocante'
  },
  {
    key: 'courseCategory',
    kind: 'courseCategoryId',
    label: 'Categoría'
  },
  {
    key: 'courseType',
    kind: 'courseTypeId',
    label: 'Tipo',
  }
]