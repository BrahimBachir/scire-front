import { ICourseType, ITopic, ICaller, ICourseCategory, ICourseStatus, IExercise, IUser, ICreationType } from '.';

export interface ICourse {
  id: number | null;
  code: string; // Código del curso
  calling_year: number;
  examDate?: Date | null;
  vacancies?: number;
  imgSrc?: string;
  rating?: number;
  colour?: string;
  details?: string;
  description: string; // Descripción del curso
  commentsCount?: number;
  students?: number;
  tags?: string[];
  official_call_url?: string;

  topics?: ITopic[];

  caller?: ICaller;
  callerId?: number;
  callerDescription?: string;

  type?: ICourseType;
  typeId?: number;
  typeDescription?: string;

  status?: ICourseStatus;
  statusId?: number;
  statusDescription?: string;

  category?: ICourseCategory;
  categoryDescription?: string;
  categoryId?: number;

  exercisesIds?: number[];
  exercises?: IExercise[];

  creator?: IUser;
  creatorId?: number;
  contributors?: IUser[];


  creationType?: ICreationType;
  creationTypeDescription?: string;
  creationTypeCode?: string;
}

export interface ICourseExtraInfo {
  tags: string[];
  callerId?: number;
  typeId?: number;
  categoryId?: number;
  vacancies?: number;
  official_call_url?: string;
  calling_year: number;
  examDate?: Date | null;
}

export interface ICourseGeneralInfo {
  code: string;
  description: string;
  details?: string;
  imgSrc?: string;
  statusId?: number;
}


export interface ICourseProgress {
  courseProgress: number;
  topics: ITopicProgress[];
}

export interface ITopicProgress {
  topicId: number;
  totalArticlesInTopic: number;
  completedArticlesInTopic: number;
  topicProgress: number;
  topicDescription: string;
  topicName: string;
}

export interface IAllArticlesProgress {
  entityId: number;
  articles: IArticleProgress[];
}

export interface IArticleProgress {
  id?: number;
  userId?: number;
  courseId?: number;
  ruleId?: number;
  topicId?: number;
  articleId: number;
  artiCode?: string;
  text_reviewed?: boolean;
  video_reviewed?: boolean;
  diagrams_reviewed?: boolean;
  flashcards_reviewed?: boolean;
  questions_reviewed?: boolean;
  completed?: boolean;
  percentage?: number;
}

export const STEP_FIELD_MAP: Record<string, keyof IArticleProgress> = {
  text: 'text_reviewed',
  videos: 'video_reviewed',
  diagrams: 'diagrams_reviewed',
  flashcards: 'flashcards_reviewed',
  questions: 'questions_reviewed',
  //final: 'completed'
};
