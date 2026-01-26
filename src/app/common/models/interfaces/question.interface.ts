import { IGeneratedBy, IAnswer, IArticle, IRule, ITopic, ICreationType } from ".";

export interface IQuestion {
    id: number;
    text: string;
    answers: IAnswer[];
    topic?: ITopic;
    difficulty: number;
    difficultyId?: number;
    explanation: string;
    answered?: boolean;
    selected?: boolean;
    real?: boolean;
    isCorrect?: boolean;
    rule?: IRule;
    article?: IArticle;
    articleId?: number;
    articlesIds?: number[];
    creatorId?: number;
    ruleId?: number;
    generatedBy?: IGeneratedBy;
    creationType?: ICreationType;
}