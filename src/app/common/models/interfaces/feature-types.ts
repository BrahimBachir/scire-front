import { Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NoteFormComponent } from 'src/app/components/core/notes/create-edit/note-create-edit.component';
import { DiagramFormComponent } from 'src/app/components/core/student/courses/common/diagram/form/diagram-form.component';
import { FlashcardFormComponent } from 'src/app/components/core/student/courses/common/flashcard/form/flashcard-form.component';
import { QuestionFormComponent } from 'src/app/components/core/student/courses/common/question/form/question-form.component';
import { VideoFormComponent } from 'src/app/components/core/student/courses/common/video/form/video-form.component';
import { DiagramStrategy, FeatureStrategy, FlashcardStrategy, NoteStrategy, QuestionStrategy, VideoStrategy } from 'src/app/strategies';

// FEATURE, TOPIC, BLOCK and ARTICLE only apply to Feedback - reactions/
// reviews/comments never target those types - but it's simpler to keep one
// shared union (matching the backend's `FeatureType`, see
// scire-api/src/common/entities/content-type.entity.ts) than a parallel type.
export type FeatureType =
  | 'COURSE'
  | 'RULE'
  | 'FLASHCARD'
  | 'QUESTION'
  | 'DIAGRAM'
  | 'VIDEO'
  | 'NOTE'
  | 'AI'
  | 'FEATURE'
  | 'TOPIC'
  | 'BLOCK'
  | 'ARTICLE';

export type VoteType = "LIKE" | "DISLIKE";


export type GenericFeatureType = 'FLASHCARD' | 'QUESTION' | 'DIAGRAM' | 'VIDEO' | 'NOTE';

export const FEATURE_COMPONENT_MAP: Record<GenericFeatureType, Type<any>> = {
  QUESTION: QuestionFormComponent,
  VIDEO: VideoFormComponent,
  NOTE: NoteFormComponent,
  FLASHCARD: FlashcardFormComponent,
  DIAGRAM: DiagramFormComponent,
};

export const CREATE_STRATEGY_MAP = new Map<string, Type<FeatureStrategy>>([
  ['QUESTION', QuestionStrategy],
  ['VIDEO', VideoStrategy],
  ['FLASHCARD', FlashcardStrategy],
  ['NOTE', NoteStrategy],
  ['DIAGRAM', DiagramStrategy],
]);

export interface FeatureFormComponent {
  form: FormGroup;
}