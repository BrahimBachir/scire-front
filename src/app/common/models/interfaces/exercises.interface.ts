import { IExerciseType } from './exercise-type.interface';
import { IQuestionType } from './question-type.interface';

export interface IExercise {
  id: number;
  code: string;
  description: string;

  type: IExerciseType;
  questions_type: IQuestionType;

  typeId: number;
  questionsTypeId: number;

  questions_number: number;
  generalQuestNum: number;
  specificQuestNum: number;

  time_per_question: number; // in seconds
  penalty: number;
  totalPoints: number;
  pointsToPass: number;

  courseId: number;
}
