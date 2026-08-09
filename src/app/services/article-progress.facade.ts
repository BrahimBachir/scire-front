import { Injectable, signal } from '@angular/core';
import {
  IAllArticlesProgress,
  IArticleProgress,
  IQueryingDto,
} from '../common/models/interfaces';
import { CourseProgressService } from './course-progress.service';

@Injectable({ providedIn: 'root' })
export class ArticleProgressFacade {
  articlesProgress = signal<IAllArticlesProgress | null>(null);
  selectedArticleProgress = signal<IArticleProgress | null>(null);
  isDirty = signal<boolean>(false);


  constructor(private service: CourseProgressService) {}

  setSelectedArticleProgress(progress: IArticleProgress) {
    this.selectedArticleProgress.set(progress);
  }

  completStep(progress: IArticleProgress, step: keyof IArticleProgress) {
    if (!progress || progress[step]) return;

    progress = { ...progress, [step]: true };
    const newPeogress = {
      id: progress.id,
      articleId: progress.articleId,
      text_reviewed: progress.text_reviewed,
      video_reviewed: progress.video_reviewed,
      diagrams_reviewed: progress.diagrams_reviewed,
      flashcards_reviewed: progress.flashcards_reviewed,
      questions_reviewed: progress.questions_reviewed,
    };

    return this.service.update(newPeogress);
  }

  getProgressPercentage(): string {
    const progress = this.selectedArticleProgress();
    return progress?.percentage
      ? `percentage-${progress?.percentage}`
      : 'percentage-0';
  }

  getProgressTooltip(): string {
    const progress = this.selectedArticleProgress();
    return progress?.percentage ? progress?.percentage + '%' : '0%';
  }

  getProgressColor(): string {
    const progress = this.selectedArticleProgress();
    return !progress?.percentage
      ? 'text-error'
      : progress?.percentage === 100
        ? 'text-success'
        : 'text-warning';
  }

  resetProgress(progress: IArticleProgress) {
    const p = this.selectedArticleProgress();
    if (!progress?.id) return;

    const resetProgress: IArticleProgress = {
      id: progress.id,
      articleId: progress.articleId,
      text_reviewed: false,
      video_reviewed: false,
      diagrams_reviewed: false,
      flashcards_reviewed: false,
      questions_reviewed: false,
    };

    return this.service.update(resetProgress);
  }

  updateIfDirty() {
    const progress = this.selectedArticleProgress();
    if (!progress?.id) return;
        const newPeogress = {
          id: progress.id,
          articleId: progress.articleId,
          text_reviewed: progress.text_reviewed,
          video_reviewed: progress.video_reviewed,
          diagrams_reviewed: progress.diagrams_reviewed,
          flashcards_reviewed: progress.flashcards_reviewed,
          questions_reviewed: progress.questions_reviewed,
        };
    if (!this.isDirty()) return;
    this.isDirty.set(false);
    return this.service.update(newPeogress);
  }
}
