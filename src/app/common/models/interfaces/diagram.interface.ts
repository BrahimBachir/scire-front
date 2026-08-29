import { ICreationType, IGeneratedBy, IRule } from ".";

export interface IDiagram {
  id?: number;
  code?: string
  description?: string;
  rule?: IRule;
  ruleId?: number;
  url?: string;
  articles?: string[];
  snippet?: string;
  creatorId?: number;
  generatedBy?: IGeneratedBy;
  creationType?: ICreationType;
  creationTypeId?: number;
  articlesIds?: number[];
  blocked?: boolean;
}