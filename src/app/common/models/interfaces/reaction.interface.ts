import { IDiagram, IFlashcard, IQuestion, IUser } from ".";

export interface IReaction {
  id: number;
  description?: string;
  code?: string;
  isReviewed: boolean;
  voteType: 'LIKE' | 'DISLIKE';
  feedbackText: string | null;
  question?: IQuestion | null;
  diagram?: IDiagram | null;
  flashcard?: IFlashcard | null;
  user?: IUser | null;
}

