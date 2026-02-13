import { FilterConfig } from "../../models/interfaces";

export const CommonFiltersData: FilterConfig[] = [ 
  {
    key: 'search',
    kind: 'searchTerm',
    label: 'Buscar',
    minLength: 3
  }/* ,
  {
    key: 'topic',
    kind: 'topicId',
    label: 'Tema'
  } */,
  {
    key: 'ruleId',
    kind: 'ruleId',
    label: 'Norma',
    dependsOn: 'topic'
  },
  {
    key: 'articleId',
    kind: 'articleId',
    label: 'Artículo',
    dependsOn: 'ruleId'
  },
]