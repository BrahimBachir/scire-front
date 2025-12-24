import { IArticle, IRule, IUser } from ".";

export interface INote {
  id: number;
  content: any;
  color?: string | null;
  title?: string | null;
  favourite?: boolean | null;
  rule?: IRule;
  article?: IArticle;
  creatorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  creator: IUser;
}