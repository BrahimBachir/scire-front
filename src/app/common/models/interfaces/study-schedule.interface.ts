export interface IScheduleArticleEvent {
  type: 'article';
  date: Date;
  topicId: number;
  topicName: string;
  articleId: number;
  articleTitle: string;
}

export interface IScheduleTestEvent {
  type: 'topicTest';
  date: Date;
  topicId: number;
  topicName: string;
}

export type IScheduleEvent = IScheduleArticleEvent | IScheduleTestEvent;

export interface ITopicScheduleSummary {
  topicId: number;
  topicName: string;
  startDate: Date;
  endDate: Date;
  testDate: Date;
  articleCount: number;
}

export interface ICourseStudySchedule {
  events: IScheduleEvent[];
  topicSummaries: ITopicScheduleSummary[];
  examDate: Date;
  totalDays: number;
  studyDays: number;
  totalArticles: number;
  articlesPerDayAvg: number;
  insufficientTime: boolean;
  shortfallDays: number;
}

export interface IScheduleTopicInput {
  id: number;
  name: string;
  articles: { id: number; title: string }[];
}
