import { IFlashcard } from "./flashcard.interface";
import { IQuestion } from "./question.interface";
import { IScheme } from "./scheme.interface";
import { IUser } from "./user.interface";

export interface IReaction {
  id: number;
  description?: string;
  code?: string;
  isReviewed: boolean;
  voteType: 'LIKE' | 'DISLIKE';
  feedbackText: string | null;
  question?: IQuestion | null;
  scheme?: IScheme | null;
  flashcard?: IFlashcard | null;
  user?: IUser | null;
}

