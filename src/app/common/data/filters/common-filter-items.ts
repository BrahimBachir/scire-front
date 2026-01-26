import { FilterConfig } from "../../models/interfaces";

export const CommonFiltersData: FilterConfig[] = [ 
  {
    key: 'search',
    kind: 'searchTerm',
    label: 'Buscar',
    minLength: 3
  },
  {
    key: 'topic',
    kind: 'topicId',
    label: 'Tema'
  },
  {
    key: 'rule',
    kind: 'rule',
    label: 'Norma',
    dependsOn: 'topic'
  },
  {
    key: 'article',
    kind: 'article',
    label: 'Artículo',
    dependsOn: 'rule'
  },
]