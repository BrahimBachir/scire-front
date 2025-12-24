import { IReaction } from "./reaction.interface";
import { IRule } from "./rule.interface";

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