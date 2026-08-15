import { IArticleProgress } from "./course.interface";
import { IRule } from "./rule.interface";


export interface IArticle {
  id: number;
  boeId?: string;
  description: string;
  book?: string;
  title?: string;
  chapter?: string;
  section?: string;
  subsection?: string;
  content: string;
  versions: IArticleVersion[];
  repealed?: boolean;
  lastUpdate?: Date;
  selected?: boolean;
  rule?: IRule;
  ruleId?: number;
  progress?: IArticleProgress;
}

export interface IArticleVersion {
  id: number;
  boeNormaId: string;
  publicationDate: string;
  effectiveDate: string;
  title: string;
  paragraphs: IParagraph[];
  blockquote?: IParagraph[];
}

export interface IParagraph {
  "#text": string;
  "@_class": string
}