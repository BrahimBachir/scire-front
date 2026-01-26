import { FilterConfig } from "../../models/interfaces";

export const RuleFiltersData: FilterConfig[] = [ 
  {
    key: 'search',
    kind: 'searchTerm',
    label: 'Buscar',
    minLength: 3
  },
  {
    key: 'ruleAmbitId',
    kind: 'ruleAmbitId',
    label: 'Ámbito'
  },
  {
    key: 'ruleGazetteId',
    kind: 'ruleGazetteId',
    label: 'Diario'
  },
  {
    key: 'ruleTypeId',
    kind: 'ruleTypeId',
    label: 'Tipo'
  }
]