export interface IDailyActivityPoint {
  date: string;
  count: number;
}

export interface IActivityTrend {
  daily: IDailyActivityPoint[];
  currentPace: number;
  requiredPace: number;
  bestDay: number;
  streak: boolean[];
  estimatedCompletionDate: Date | null;
}

export interface ITopicPerformance {
  topicId: number;
  topicName: string;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  correctPercentage: number;
  incorrectPercentage: number;
  skippedPercentage: number;
}

export interface IWeakSpotCell {
  typeCode: string;
  accuracy: number | null;
}

export interface IWeakSpotRow {
  topicId: number;
  topicName: string;
  accuracy: number;
  cells: IWeakSpotCell[];
}

export interface IWeakSpots {
  totalTopicsInCourse: number;
  rows: IWeakSpotRow[];
}

export interface ISkillPoint {
  topicId: number;
  topicName: string;
  accuracy: number;
  lastTestedAt: Date;
}

export interface ISkillsRadar {
  topics: ISkillPoint[];
}

export interface IPassProbability {
  probability: number;
  accuracy: number;
  coverage: number;
  paceRatio: number;
}

export interface IStudyPlanItem {
  title: string;
  reason: string;
}
