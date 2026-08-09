export interface ICourseMetrics {
  description: string;
  exam_date: Date;
  days_to_exam: number;
  progress: number;
}

export interface ITopicsMetrics {
  description: string;
  progress: number;
  status: string;
  articles_reviewes: number;
  total_articles: number;
}

export interface IExamReadiness {
  exercise_name: string;
  user_points: number;
  needed_points: number;
  isReady: boolean;
  all_strategy: IAllStrategy;
  known_strategy: IKnownStrategy;
}

export interface IAllStrategy {
  user_correc_questions: number;
  needed_correc_questions: number; //Scenario B: Answering All Questions (Worst Case)
  user_correct_percentage: number;
  needed_correc_percentage: number;
}

export interface IKnownStrategy {
  user_correc_questions: number;
  needed_correc_questions: number; //Scenario A: Minimum Questions (Strategic)
  user_correct_percentage: number;
  needed_correc_percentage: number;
}

export class IUserActivity {
  previous_activity: IProgressActivity;
  upcoming_activity: IProgressActivity;
}


export class IProgressActivity {
  topic_id: number;
  article_name: string;
  rule_name: string;
  text_reviewed: boolean;
  text_reviewed_at: Date;

  video_reviewed: boolean;
  video_reviewed_at: Date;

  diagrams_reviewed: boolean;
  diagrams_reviewed_at: Date;

  flashcards_reviewed: boolean;
  flashcards_reviewed_at: Date;

  questions_reviewed_at: Date;
  questions_reviewed: boolean;
}