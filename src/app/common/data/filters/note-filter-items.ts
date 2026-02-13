import { FilterConfig, TernaryItem } from "../../models/interfaces";

export const NoteFiltersData: FilterConfig[] = [
  {
    key: 'search',
    kind: 'searchTerm',
    label: 'Buscar',
    minLength: 3
  },
  {
    key: 'ruleId',
    kind: 'ruleId',
    label: 'Norma'
  },
  {
    key: 'articleId',
    kind: 'articleId',
    label: 'Artículo',
    dependsOn: 'ruleId'
  },
  {
    key: 'favorite',
    kind: 'favorite',
    label: 'Favorita/o'
  }
]

export const NoteFavoOptions: TernaryItem[] = [
  {
    description: 'Todas',
    value: null
  },
  {
    description: 'Sí',
    value: true
  },
  {
    description: 'No',
    value: false
  }
]