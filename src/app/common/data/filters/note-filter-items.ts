import { FilterConfig, TernaryItem } from "../../models/interfaces";

export const NoteFiltersData: FilterConfig[] = [
  {
    key: 'search',
    kind: 'searchTerm',
    label: 'Buscar',
    minLength: 3
  },
  {
    key: 'rule',
    kind: 'rule',
    label: 'Norma'
  },
  {
    key: 'article',
    kind: 'article',
    label: 'Artículo',
    dependsOn: 'rule'
  },
  {
    key: 'favorite',
    kind: 'ternary',
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