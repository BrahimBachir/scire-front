import { IArticle, IBlock, ICourse, IFlashcard, INote, IQuestion, IRule, ITopic, IUser, IVideo, IDiagram } from ".";

export interface IIncomingEntity {
    total: number;
    rows: IUser[] | IFlashcard[] | IDiagram[] | IVideo[] | INote[] | ICourse[] | IRule[] | IArticle[] | IBlock[] | ITopic[];
}

export interface IncomingNavigableEntity {
    item: IFlashcard | IDiagram | IQuestion | IDiagram;
    hasNext: boolean | null;
    hasPrevious: boolean | null;
    nextId?: number;
    previousId?: number;
}

export interface DeletedElement {
    message: string;
}