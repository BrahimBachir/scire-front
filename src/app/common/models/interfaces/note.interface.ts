import { IArticle, IRule, IUser } from ".";

export interface INote {
  id?: number;
  content: any;
  color?: string | null;
  title?: string | null;
  favorite?: boolean | null;
  rule?: IRule | null;
  ruleId?: number | null;
  article?: IArticle | null;
  articles?: string[] | null;
  creatorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  creator?: IUser;
  articlesIds: number[];
}