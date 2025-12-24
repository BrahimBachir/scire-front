export interface IGanttTask {
  id?: number;
  description: string;
  startDate: Date;
  endDate: Date;
  type: 'summary' | 'scaffolder' | 'test' | 'mockExam';
  completed?: boolean;
}

export interface ITaskType {
  description: string;
  code: string;
}