import { IArticle, IRule, IGeneratedBy, ICreationType } from ".";

export interface IFlashcard {
  id?: number;
  question: string;
  answer: string;
  topic?: { id: number };
  rule?: IRule;
  article?: IArticle;
  articles?: string[] | null;
  creatorId?: number;
  ruleId?: number;
  generatedBy?: IGeneratedBy;
  creationType?: ICreationType;
  creationTypeId?: number;
  articlesIds?: number[];
  blocked?: boolean;
}