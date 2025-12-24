import { ITopic } from "./topic.interface";

export interface ITrackRegister {
  id?: number;
  topic: ITopic;
  studyDate: string;
  summaryReviewed?: boolean;
  scaffolderReviewed?: boolean;
  flashcardReviewed?: boolean;
  mockTestQuarterDone?: boolean;
  mockTestThirdDone?: boolean;
  mockTestHalfDone?: boolean;
  mockTestCompleteDone?: boolean;
  averageScore?: number;
  keyErrors?: string;
  notes?: string;
}