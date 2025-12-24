import { IAnswer, IQuestion } from ".";

export interface ITestQuestion {
    id: number;
    question: IQuestion;
    answered: boolean;
    correct: boolean;
    selectedAnswer?: IAnswer;
}