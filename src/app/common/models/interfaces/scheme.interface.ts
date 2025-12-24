import { IRule } from "./rule.interface";

export interface IScheme {
  id: number;
  code?: string
  description?: string;
  rule: IRule;
  url?: string;
  articles?: string[];
  snippet?: string;
  creatorId?: number;
}