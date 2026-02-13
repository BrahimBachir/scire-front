export interface IArticlesFeatures {
  id?: number;
  articleId: number;
  questionId?: number;
  videoId?: number;
  diagramId?: number;
  flashcardId?: number;
  noteId?: number;
  favorite?: boolean;
  creatorId: number;
  startSeconds?: number;
  endSeconds?: number;
}