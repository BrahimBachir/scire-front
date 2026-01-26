import { ITopicCategory, ICourse, IQuestion, ISection, ITopic, IArticle, IRule, IScheme } from "../interfaces";

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
  allSelectedArticle?: IArticle[];
  selectedRule?: IRule
  selectedScheme?: IScheme
  selectedTopic?: ITopic
}

