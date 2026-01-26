import { FeatureType, IArticle, IFieldMode, IFlashcard, IQuestion, IReaction, IRule, IScheme, IVideo } from ".";

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
  element?: IVideo | IFlashcard | IQuestion | IScheme; // present = EDIT
  mode: IFieldMode;
  rule?: IRule;
  article?: IArticle | null;
  articleId?: number | null;
  ruleId?: number | null;
  courseId?: number;
}
