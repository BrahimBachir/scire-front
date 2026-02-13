import { IExerciseType } from "./exercise-type.interface";
import { IQuestionType } from "./question-type.interface";

export interface IExercise {
  id: number;
  code: string;
  description: string;

  type: IExerciseType;
  questionsType: IQuestionType;
  
  typeId: number;
  questionsTypeId: number;

  questionCount: number;
  generalQuestNum: number;
  specificQuestNum: number;
  
  timePerQuestion: number; // in seconds
  penaltyPerWrongAnswer: number;
  totalPoints: number;
  pointsToPass: number;
  
  courseId: number;
}
