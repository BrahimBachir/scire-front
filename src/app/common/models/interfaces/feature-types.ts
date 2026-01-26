import { Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NoteFormComponent } from 'src/app/components/core/notes/create-edit/note-create-edit.component';
import { AiFormComponent } from 'src/app/components/core/student/courses/common/ai-element/ai-element-create.component';
import { FlashcardFormComponent } from 'src/app/components/core/student/courses/common/flashcard/form/flashcard-form.component';
import { QuestionFormComponent } from 'src/app/components/core/student/courses/common/question/form/question-form.component';
import { SchemeFormComponent } from 'src/app/components/core/student/courses/common/scheme/form/scheme-form.component';
import { VideoFormComponent } from 'src/app/components/core/student/courses/common/video/form/video-form.component';
import { FeatureStrategy, FlashcardStrategy, NoteStrategy, QuestionStrategy, VideoStrategy } from 'src/app/strategies';
import { SchemeStrategy } from 'src/app/strategies/scheme.strategy';

export type FeatureType = 'COURSE' | 'RULE' | 'FLASHCARD' | 'QUESTION' | 'SCHEME' | 'VIDEO' | 'NOTE' | 'AI';

export type VoteType = "LIKE" | "DISLIKE";


export type GenericFeatureType = 'FLASHCARD' | 'QUESTION' | 'SCHEME' | 'VIDEO' | 'NOTE' | 'AI';

export const FEATURE_COMPONENT_MAP: Record<GenericFeatureType, Type<any>> = {
  QUESTION: QuestionFormComponent,
  VIDEO: VideoFormComponent,
  NOTE: NoteFormComponent,
  FLASHCARD: FlashcardFormComponent,
  AI: AiFormComponent,
  SCHEME: SchemeFormComponent,
};

export const CREATE_STRATEGY_MAP = new Map<string, Type<FeatureStrategy>>([
  ['QUESTION', QuestionStrategy],
  ['VIDEO', VideoStrategy],
  ['FLASHCARD', FlashcardStrategy],
  ['NOTE', NoteStrategy],
  ['SCHEME', SchemeStrategy],
  //['AI', AiCreateStrategy],
]);

export interface FeatureFormComponent {
  form: FormGroup;
}