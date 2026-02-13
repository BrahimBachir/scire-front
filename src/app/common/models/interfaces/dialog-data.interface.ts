import { FeatureType, IArticle, IExercise, IFieldMode, IFlashcard, IQuestion, IReaction, IRule, IDiagram, ITopic, IVideo } from ".";

export interface DialogData {
  action: string;
  title?: string;
  entity: IReaction | IRule;
}

export interface ReactionResponse {
  voteType?: string;
  likeCount?: number;
  dislikeCount?: number;
}

export interface CreateDialogData {
  feature: FeatureType;
  articlesIds: number[];
  element?: IVideo | IFlashcard | IQuestion | IDiagram | IExercise | ITopic | IVideo;
  mode: IFieldMode;
  rule?: IRule;
  article?: IArticle | null;
  articleId?: number | null;
  ruleId?: number | null;
  courseId?: number;
  fromAI?: boolean;
}
