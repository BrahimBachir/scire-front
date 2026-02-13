import { ITopicCategory, ICourse, IQuestion, ISection, ITopic, IArticle, IRule, IDiagram } from "../interfaces";

export interface LearningState {
  categories: ITopicCategory[] | null;
  sections: ISection[] | null;
  topics: ITopic[] | null;
  questions: IQuestion[] | null;
  courses: ICourse[] | null;
  selectedCourse: ICourse | null;
  logedIn?: boolean;
  verifying?: boolean;
  selectedArticle?: IArticle
  selectedArticlesIds?: number[];
  selectedRule?: IRule
  selectedDiagram?: IDiagram
  selectedTopic?: ITopic
}

