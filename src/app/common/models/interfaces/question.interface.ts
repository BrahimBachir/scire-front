import { IAnswer } from "./answare.interface";
import { IArticle } from "./article.interface";
import { IRule } from "./rule.interface";
import { ITopic } from "./topic.interface";

export interface IQuestion {
    id: number;
    text: string;
    answers: IAnswer[];
    topic?: ITopic;
    difficulty: number;
    explanation: string;
    answered?: boolean;
    selected?: boolean;
    isCorrect?: boolean;
    rule?: IRule;
    article?: IArticle;
    creatorId?: number;
}