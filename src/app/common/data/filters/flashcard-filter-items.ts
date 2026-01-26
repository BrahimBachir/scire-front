import { FilterConfig } from "../../models/interfaces";

export const FlashcardFiltersData: FilterConfig[] = [ 
  {
    key: 'search',
    kind: 'searchTerm',
    label: 'Buscar',
    minLength: 3
  },
/*   {
    key: 'topic',
    kind: 'topic',
    label: 'Tema'
  }, */
  {
    key: 'rule',
    kind: 'rule',
    label: 'Norma',
    //dependsOn: 'topic'
  },
  {
    key: 'article',
    kind: 'article',
    label: 'Artículo',
    dependsOn: 'rule'
  },
]