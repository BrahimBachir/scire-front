import { Injectable, signal } from "@angular/core";
import { IAllArticlesProgress, IArticleProgress, IQueryingDto } from "../common/models/interfaces";
import { CourseProgressService } from "./course-progress.service";

@Injectable({ providedIn: 'root' })
export class ArticleProgressFacade {
  articlesProgress = signal<IAllArticlesProgress | null>(null);
  selectedArticleProgress = signal<IArticleProgress | null>(null);

  //TODO: BUG Hay un error en algún punto y se está lanzando 2 veces un crear que en el back da error de clave dublicada 
  // Pasa en los dos, tanto al estudiar una ley como al estudair un tema con varias leyes

  private dirty = false;

  constructor(private courseProgressService: CourseProgressService) { }

  loadForCourse(courseId: number, topicId: number) {
    return this.courseProgressService
      .getCourseArticlesProgress({ courseId, topicId })
      .subscribe(res =>{
        this.articlesProgress.set(res);
      });
  }

  loadForRule(ruleId: number) {
    return this.courseProgressService
      .getRuleArticlesProgress({ ruleId })
      .subscribe(res =>{
        this.articlesProgress.set(res);
      });
  }

  loadArticleProgress(progress: IArticleProgress) {
    this.courseProgressService.create(progress).subscribe(progress => {
      this.selectedArticleProgress.set(progress);
      this.dirty = false;
    });
  }

  markStepCompleted(step: keyof IArticleProgress) {
    const progress = this.selectedArticleProgress();
    if (!progress || progress[step]) return;

    this.selectedArticleProgress.set({ ...progress, [step]: true });
    this.dirty = true;
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

  getArticleProgressPercent(id: number): string {
    const aps = this.articlesProgress();
    return (
      aps?.articles.find(a => a.id === id)?.articleProgress?.toString() ||
      '0'
    );
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
