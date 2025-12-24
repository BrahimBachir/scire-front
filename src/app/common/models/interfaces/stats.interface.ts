export interface IChartPoint {
  name: string;
  value: number;
}

export interface IChartSeries {
  name: string;
  series: IChartPoint[];
}

export interface IStats {
  averageTimePerQuestionPerTopic: IChartSeries;
  topicPercentageCoverage: IChartSeries;
  averageScorePerTopic: IChartSeries;
  topicRanking: IChartSeries;
  scoreTrend: IChartSeries;
  averageScore: number;
}
