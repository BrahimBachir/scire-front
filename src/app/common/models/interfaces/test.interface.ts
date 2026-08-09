import {
  ITestQuestion,
  IQuestion,
  ITopic,
  IUser,
  ITaskType,
  ITestType,
  IDifficulty,
  ISection,
  ITopicCategory,
  IExercise,
} from '.';

export interface ITest {
  id: number;
  num_questions: number;
  timed?: boolean;

  corrct_answers?: number;
  wrong_answers?: number;
  not_answered?: number;
  questions?: IQuestion[];
  test_questions?: ITestQuestion[];
  time_allowed?: number;
  time_consumed?: number;
  original_time?: number;
  date?: Date | undefined;
  score?: number;
  topic?: ITopic;
  completed?: boolean;

  user?: IUser;
  category?: ITopicCategory;
  categoryId?: number;
  difficulty?: IDifficulty;
  section?: ISection;
  type?: ITestType;
  exercise?: IExercise;

  creatorId?: number;
  sectionId?: number;
  courseId?: number;
  difficultyId?: number;
  typeId?: number;
  topicId?: number;
  exerciseId?: number;

  topicsIds?: number[];
}

export interface IIncomingTests {
  total: number;
  rows: ITest[];
}

export interface ITestResults {
  data_items: IBasicDataItem[];
  time_per_question: IBasicDataItem;
  score: number;
  score_diff: number;
  score_diff_percent: number;
  max_score: number;
}

export interface IBasicDataItem {
  code: string;
  color: string;
  char_color: string;
  icon: string;
  title: number | string;
  percentage: number;
  difference: number;
  subtitle: string;
}
