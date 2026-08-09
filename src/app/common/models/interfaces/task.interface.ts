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

export interface IEpic {
  id: number;
  name?: string;
  description: string;
  startDate: Date;
  endDate: Date;
  percentage_completed: number;
  tasks: ITask[];
}

export interface ITask {
  id?: number;
  name?: string;
  description: string;
  startDate: Date;
  endDate: Date;
  percentage_completed?: number | null;
  subtasks: ICheckPoint[];
  completed?: boolean;
  partially_completed?: boolean;
}

export interface ICheckPoint {
  id?: number;
  name?: string;
  description: string;
  percentage_completed?: number | null;
  completed?: boolean;
}