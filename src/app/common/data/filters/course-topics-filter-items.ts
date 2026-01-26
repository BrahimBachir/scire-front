import { FilterConfig, TernaryItem } from "../../models/interfaces";

export const CourseTopicsFiltersData: FilterConfig[] = [
  {
    key: 'search',
    kind: 'searchTerm',
    label: 'Buscar',
    minLength: 3
  }
]