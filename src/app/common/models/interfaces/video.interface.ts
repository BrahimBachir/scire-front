import { IRule, IArticlesFeatures, ICreationType } from ".";

export interface IVideo {
  id: number;
  code?: string
  startSeconds?: number;
  endSeconds?: number;
  title?: string;
  description?: string;
  url: string;
  rule: IRule;
  article?: string;
  quality?: string;
  topic?: { id: number };
  creatorId?: number;
  ruleId?: number;
  creationType?: ICreationType;
  creationTypeId?: number;
  articlesIds?: number[];
  articles_features?: IArticlesFeatures[];
}