import { IArticle } from "./article.interface";
import { IRule } from "./rule.interface";
import { ITopic } from "./topic.interface";

export interface IFlashcard {
  id: number;
  question: string;
  answer: string;
  topic: { id: number };
  rule?: IRule;
  article?: IArticle;
  creatorId?: number;
}