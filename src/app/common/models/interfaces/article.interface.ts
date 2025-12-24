export interface IParagraph {
    "#text": string;
    "@_class": string
}

export interface IArticle {
    id?: number;
    boeId?: string;
    title: string;
    articleNumber?: string;
    versions: ArticleVersion[];
    repealed?: boolean;
    lastUpdate?: Date;
}

export interface ArticleVersion {
    id: number;
    boeNormaId: string;
    publicationDate: string;
    effectiveDate: string;
    title: string;
    paragraphs: IParagraph[];
    blockquote?: IParagraph[];
}