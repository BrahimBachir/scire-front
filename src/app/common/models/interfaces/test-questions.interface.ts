import { IAnswer, IQuestion } from ".";

export interface ITestQuestion {
    id: number;
    testId?: number;
    questionId?: number;
    question: IQuestion;
    answered: boolean;
    correct: boolean;
    selectedAnswer?: IAnswer;
    postponed?: boolean;
    visited?: boolean;
}