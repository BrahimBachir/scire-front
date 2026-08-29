export type IScheduleEventStatus = 'completed' | 'missed' | 'today' | 'pending';

export interface IScheduleArticleEvent {
  type: 'article';
  date: Date;
  topicId: number;
  topicName: string;
  articleId: number;
  articleTitle: string;
  status: IScheduleEventStatus;
}

export interface IScheduleTestEvent {
  type: 'topicTest';
  date: Date;
  topicId: number;
  topicName: string;
  status: IScheduleEventStatus;
  testId?: number;
}

export type IScheduleEvent = IScheduleArticleEvent | IScheduleTestEvent;

export interface ICourseStudySchedule {
  events: IScheduleEvent[];
  examDate: Date | null;
  totalDays: number;
  studyDays: number;
  totalArticles: number;
  articlesPerDayAvg: number;
  insufficientTime: boolean;
  shortfallDays: number;
  noExamDate: boolean;
}
