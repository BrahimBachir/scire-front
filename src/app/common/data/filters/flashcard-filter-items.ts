import { FilterConfig } from "../../models/interfaces";

export const FlashcardFiltersData: FilterConfig[] = [ 
  {
    key: 'search',
    kind: 'searchTerm',
    label: 'Buscar',
    minLength: 3
  },
/*   {
    key: 'topicId',
    kind: 'topicId',
    label: 'Tema'
  }, 
  {
    key: 'blockId',
    kind: 'blockId',
    label: 'Tema'
    dependsOn: 'topicId'
  }, */
  {
    key: 'ruleId',
    kind: 'ruleId',
    label: 'Norma',
    //dependsOn: 'topicId'
  },
  {
    key: 'articleId',
    kind: 'articleId',
    label: 'Artículo',
    dependsOn: 'ruleId'
  },
]