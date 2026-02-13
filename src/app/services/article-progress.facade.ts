import { Injectable, signal } from "@angular/core";
import { IAllArticlesProgress, IArticleProgress, IQueryingDto } from "../common/models/interfaces";
import { CourseProgressService } from "./course-progress.service";

@Injectable({ providedIn: 'root' })
export class ArticleProgressFacade {
  articlesProgress = signal<IAllArticlesProgress | null>(null);
  selectedArticleProgress = signal<IArticleProgress | null>(null);

  private dirty = false;

  constructor(private courseProgressService: CourseProgressService) { }

getProgressByTopic(courseId: number, topicId: number, articleId: number) {
    return this.courseProgressService
      .getProgressByTopic(courseId, topicId, articleId)
      .subscribe(res =>{
        this.selectedArticleProgress.set(res);
      });
  }

getProgressByRule(ruleId: number, articleId: number) {
    return this.courseProgressService
      .getProgressByRule(ruleId, articleId)
      .subscribe(res =>{
        this.selectedArticleProgress.set(res);
      });
  }

  setSelectedArticleProgress(progress: IArticleProgress) {
    this.selectedArticleProgress.set(progress);
  }

  createProgress(progress: IArticleProgress) {
    this.courseProgressService.create(progress).subscribe(progress => {
      this.selectedArticleProgress.set(progress);
      this.dirty = false;
    });
  }

  markStepCompleted(step: keyof IArticleProgress) {
    let p = this.selectedArticleProgress();
    if (!p || p[step]) return;

    p = { ...p, [step]: true }
    const newPeogress = {
      id: p.id,
      articleId: p.articleId,
      text_reviewed: p.text_reviewed,
      video_reviewed: p.video_reviewed,
      diagrams_reviewed: p.diagrams_reviewed,
      flashcards_reviewed: p.flashcards_reviewed,
      questions_reviewed: p.questions_reviewed,
    }

    this.courseProgressService.update(newPeogress).subscribe(updated => {
      this.selectedArticleProgress.set(updated);
    });
  }

  flushIfDirty() {
    if (!this.dirty) return;
    const p = this.selectedArticleProgress();
    if (!p || !p.id) return;

    const newPeogress = {
      id: p.id,
      articleId: p.articleId,
      text_reviewed: p.text_reviewed,
      video_reviewed: p.video_reviewed,
      diagrams_reviewed: p.diagrams_reviewed,
      flashcards_reviewed: p.flashcards_reviewed,
      questions_reviewed: p.questions_reviewed,
    }
    this.courseProgressService.update(newPeogress).subscribe(() => {
      this.dirty = false;
    });
  }

  getProgressPercentage(): string {
    const progress = this.selectedArticleProgress();
    return progress?.percentage ? `percentage-${progress?.percentage}` : 'percentage-0';
  }

  getProgressTooltip(): string {
    const progress = this.selectedArticleProgress();
    return progress?.percentage ? progress?.percentage  +'%' : '0%';
  }
  
  getProgressColor(): string {
    const progress = this.selectedArticleProgress();
    return !progress?.percentage ? 'text-error' : progress?.percentage === 100 ? 'text-success': 'text-warning';
  }
  
  resetCurrentArticleProgress() {
    const p = this.selectedArticleProgress();
    if (!p?.id) return;

    const resetProgress: IArticleProgress = {
      id: p.id,
      articleId: p.articleId,
      text_reviewed: false,
      video_reviewed: false,
      diagrams_reviewed: false,
      flashcards_reviewed: false,
      questions_reviewed: false,
    };

    this.courseProgressService.update(resetProgress).subscribe(updated => {
      this.selectedArticleProgress.set(updated);
    });
  }
}
