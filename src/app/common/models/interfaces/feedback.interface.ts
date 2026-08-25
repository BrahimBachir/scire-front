import { IUser } from '.';
import { FeatureType } from './feature-types';

export interface IFeedbackType {
  id: number;
  code: string;
  description: string;
}

export interface IFeedbackAttachment {
  id: number;
  originalName: string;
  mimeType: string;
}

export interface IFeedback {
  id: number;
  featureId: number;
  featureType: FeatureType;
  feedbackType?: IFeedbackType;
  feedbackTypeId: number;
  text: string;
  user?: IUser;
  attachments?: IFeedbackAttachment[];
  targetLabel?: string;
  createdAt?: Date;
}

export interface IFeedbackSearchItem {
  id: number;
  code: string | null;
  description: string;
}

// Labels are plain Spanish, matching the rest of the app's UI copy (route
// titles, dialog text, etc. are hardcoded Spanish rather than i18n keys -
// only the sidebar nav captions go through ngx-translate).
export const FEEDBACK_FEATURE_TYPES: { value: FeatureType; label: string }[] = [
  { value: 'COURSE', label: 'Curso' },
  { value: 'FEATURE', label: 'Funcionalidad' },
  { value: 'TOPIC', label: 'Tema' },
  { value: 'BLOCK', label: 'Bloque' },
  { value: 'ARTICLE', label: 'Artículo' },
  { value: 'DIAGRAM', label: 'Diagrama' },
  { value: 'QUESTION', label: 'Pregunta' },
  { value: 'FLASHCARD', label: 'Flashcard' },
  { value: 'VIDEO', label: 'Vídeo' },
];
