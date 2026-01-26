import { IArticleProgress } from "./course.interface";
import { IRule } from "./rule.interface";

export interface IParagraph {
    "#text": string;
    "@_class": string
}

export interface IArticle {
    id?: number;
    boeId?: string;
    title: string;
    articleNumber?: string;
    versions: IArticleVersion[];
    repealed?: boolean;
    lastUpdate?: Date;
    selected?: boolean;
    rule?: IRule;
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