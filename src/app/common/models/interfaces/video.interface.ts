import { IRule } from "./rule.interface";

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
  articlesIds?: number[];
}