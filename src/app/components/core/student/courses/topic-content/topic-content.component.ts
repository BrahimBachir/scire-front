import { Component, signal, effect, model, untracked } from '@angular/core';
import { ActivatedRoute, NavigationStart } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  IArticle,
  IArticleProgress,
  IParagraph,
  IRule,
  IUser,
} from 'src/app/common/models/interfaces';
import {
  ArticleProgressFacade,
  LegislationService,
  TopicService,
} from 'src/app/services';
import { AppCreateGenericElementComponent } from '../common/create-generic-element/create-generic-element.component';
import { ArticleTabsComponent } from './article-tabs/article-tabs.component';
import { ArticleStepperComponent } from './article-stepper/article-stepper.component';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { selectLogedUser } from 'src/app/common/store/selectors';
import {
  setAllSelectedArticles,
  setSelectedArticle,
  setSelectedRule,
} from 'src/app/common/store/actions';
import { IconModule } from 'src/app/icon/icon.module';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-topic-content',
  templateUrl: './topic-content.component.html',
  imports: [
    CommonModule,
    MatCardModule,
    IconModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTooltipModule,
    AppCreateGenericElementComponent,
    ArticleTabsComponent,
    ArticleStepperComponent,
  ],
  styleUrl: 'topic-content.component.scss',
})
export class AppTopicContentComponent {
  article = signal<IArticle | null>(null);
  tabs = signal<IArticle[] | null>([]);
  selectedRule: IRule | null = null;
  //loggedUser = signal<IUser | null>(null);

  selectedTabIndex: number = 0;
  topicId: number = 0;
  courseId: number = 0;
  ruleId: number = 0;
  articleId: number = 0;
  entityToCreate = model<string>('');
  firstLoad: boolean = false;

  constructor(
    route: ActivatedRoute,
    private legislation: LegislationService,
    private topicService: TopicService,
    public progress: ArticleProgressFacade,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.topicId = Number(route.snapshot.paramMap.get('topicId'));
    this.courseId = Number(route.snapshot.paramMap.get('courseId'));
    this.ruleId = Number(route.snapshot.paramMap.get('ruleId'));
    /* this.store
      .select(selectLogedUser)
      .subscribe((user) => this.loggedUser.set(user)); */

    this.loadTabs();
  }

  loadTabs() {
    if (this.topicId) this.loadTopicArticles();
    else this.loadRuleArticles();
  }

  loadTopicArticles() {
    this.topicService
      .getArticles(this.topicId, { courseId: this.courseId })
      .subscribe((articles) => {
        this.tabs.set(articles);
        if (!articles || !articles.length) return;

        const index = this.getInitialTabIndex();
        this.selectedTabIndex = index;
      });
  }

  loadRuleArticles() {
    this.legislation.getRuleArticles(this.ruleId).subscribe((articles) => {
      this.tabs.set(articles);
      if (!articles || !articles.length) return;

      const index = this.getInitialTabIndex();
      this.selectedTabIndex = index;
    });
  }

  loadRule() {
    this.legislation.getRuleById(this.ruleId).subscribe((rule) => {
      this.selectedRule = rule;
    });
  }

  selectTab(tab: IArticle) {
    this.updateIfDirty();
    this.article.set(tab);
    this.setArticle(tab);
  }

  setArticle(article: IArticle): void {
    const ids: number[] = [];
    if (article.id) {
      ids.push(article.id);
      this.articleId = article.id;
      this.store.dispatch(setSelectedArticle(article));
      this.store.dispatch(setAllSelectedArticles(ids));
    }

    if (article.rule && article.rule.id) {
      this.ruleId = article.rule?.id;
      this.selectedRule = article.rule;
    }

    if (this.selectedRule)
      this.store.dispatch(setSelectedRule(this.selectedRule));

    if (article.progress)
      this.progress.setSelectedArticleProgress(article.progress);
  }

  goToNextTab() {
    this.updateIfDirty();
    const tabs = this.tabs();
    if (!tabs) return;
    const currentIndex = tabs.findIndex((t) => t.id === this.articleId);

    if (currentIndex === -1) return;

    const nextIndex = currentIndex + 1;
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;

    this.selectedTabIndex = nextIndex;

    this.selectTab(nextTab);
  }

  updateIfDirty() {
    this.progress.updateIfDirty();
    const tabs = this.tabs();
    let art = this.article();
    const pro = this.progress.selectedArticleProgress();
    if (art && art?.progress && pro && tabs) {
      let updated = tabs.map((t) =>
        t.id === this.articleId ? { ...t, progress: pro } : t,
      );
      this.tabs.set(updated);
    }
  }

  private getInitialTabIndex(): number {
    const tabs = this.tabs();
    if (!tabs) return 0;
    const firstIncomplete = tabs.findIndex(
      (a) => a.progress?.percentage !== 100,
    );
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  }

  handleEntityCreationInput(value: string) {
    this.entityToCreate.set(value);
  }

  onStepChange(field: any) {
    const tabs = this.tabs();
    let article = this.article();
    if (tabs && tabs?.length > 0 && field && article && article?.progress) {
      this.progress.completStep(article.progress, field)?.subscribe((pro) => {
        const updated = tabs.map((t) =>
          t.id === this.articleId ? { ...t, progress: pro } : t,
        );

        this.tabs.set(updated);

        const updatedArticle = updated.find((art) => art.id === this.articleId);
        if (updatedArticle) this.article.set(updatedArticle);
        this.progress.setSelectedArticleProgress(pro);
      });
    }
  }

  resetArticle() {
    const tabs = this.tabs();
    let article = this.article();
    if (tabs && tabs?.length > 0 && article && article?.progress) {
      this.progress.resetProgress(article.progress)?.subscribe((pro) => {
        const updated = tabs.map((t) =>
          t.id === this.articleId ? { ...t, progress: pro } : t,
        );

        this.tabs.set(updated);

        const updatedArticle = updated.find((art) => art.id === this.articleId);
        if (updatedArticle) this.article.set(updatedArticle);
        this.progress.setSelectedArticleProgress(pro);
      });
    }
  }
}
