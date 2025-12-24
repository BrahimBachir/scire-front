import { IRule } from "./rule.interface";

export interface IVideo {
  id: number;
  code?: string
  title?: string;
  description?: string;
  url: string;
  rule: IRule;
  article?: string;
  quality?: string;
  height?: number;
  width?: number;
  startSeconds?: number;
  endSeconds?: number;
  topic?: { id: number };
  creatorId?: number;
}