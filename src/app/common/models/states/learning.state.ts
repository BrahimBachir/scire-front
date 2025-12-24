import { ICategory, ICourse, IQuestion, ISection, ITopic } from "../interfaces";

export interface LearningState {
  categories: ICategory[] | null;
  sections: ISection[] | null;
  topics: ITopic[] | null;
  questions: IQuestion[] | null;
  courses: ICourse[] | null;
  selectedCourse: ICourse | null;
  logedIn?: boolean;
  verifying?: boolean;
}

