import { FilterConfig } from "../../models/interfaces";

export const TestFiltersData: FilterConfig[] = [ 
  {
    key: 'testTypeId',
    kind: 'testTypeId',
    label: 'Tipo de test'
  },
  {
    key: 'categoryId',
    kind: 'topicCategoryId',
    label: 'Categoría'
  },
  {
    key: 'sectionId',
    kind: 'sectionId',
    label: 'Sección'
  },
  {
    key: 'topicId',
    kind: 'topicId',
    label: 'Tema'
  }
]