import { IArticle } from "./article.interface";
import { IBlock } from "./block.interface";
import { ICourse } from "./course.interface";
import { IFlashcard } from "./flashcard.interface";
import { INote } from "./note.interface";
import { IQuestion } from "./question.interface";
import { IRule } from "./rule.interface";
import { IScheme } from "./scheme.interface";
import { ITopic } from "./topic.interface";
import { IUser } from "./user.interface";
import { IVideo } from "./video.interface";

export interface IIncomingEntity {
    total: number;
    rows: IUser[] | IFlashcard[] | IScheme[] | IVideo[] | INote[] | ICourse[] | IRule[] | IArticle[] | IBlock[] | ITopic[];
}

export interface IncomingNavigableEntity {
  item: IFlashcard | IScheme | IQuestion | IScheme;
  hasNext: boolean | null;
  hasPrevious: boolean | null;
  nextId?: number;
  previousId?: number;
}

export interface DeletedElement {
    message: string;
}