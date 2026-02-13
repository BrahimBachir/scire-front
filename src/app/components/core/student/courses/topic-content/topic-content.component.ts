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
import { IArticle, IArticleProgress, IParagraph, IRule, IUser } from 'src/app/common/models/interfaces';
import { ArticleProgressFacade, LegislationService, TopicService } from 'src/app/services';
import { AppCreateGenericElementComponent } from '../common/create-generic-element/create-generic-element.component';
import { ArticleTabsComponent } from './article-tabs/article-tabs.component';
import { ArticleStepperComponent } from './article-stepper/article-stepper.component';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { selectLogedUser } from 'src/app/common/store/selectors';
import { setAllSelectedArticles, setSelectedArticle, setSelectedRule } from 'src/app/common/store/actions';
import { IconModule } from 'src/app/icon/icon.module';
@Component({
  selector: 'app-topic-content',
  templateUrl: './topic-content.component.html',
  imports: [
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
    ArticleStepperComponent
  ],
  styleUrl: 'topic-content.component.scss'
})
export class AppTopicContentComponent {
  article = signal<IArticle | null>(null);
  paragraphs = signal<IParagraph[] | null>(null);
  tabs = signal<IArticle[] | null>([]);
  selectedRule: IRule | null = null;
  loggedUser = signal<IUser | null>(null);

  selectedTabIndex: number = 0;
  topicId: number = 0;
  courseId: number = 0;
  ruleId: number = 0;
  articleId: number = 0;
  entityToCreate = model<string>('');

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
    this.store.select(selectLogedUser).subscribe((user) => this.loggedUser.set(user))

    this.loadTabs();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.progress.flushIfDirty();
      }
    });

  }

  loadTabs() {
    if (this.topicId) this.loadTopicArticles();
    else this.loadRuleArticles();
  }

  loadTopicArticles() {
    this.topicService.getArticles(this.topicId, { courseId: this.courseId })
      .subscribe(articles => {
        this.tabs.set(articles);
        if (!articles || !articles.length) return;

        const index = this.getInitialTabIndex();
        this.selectedTabIndex = index;

        const tab = articles[index];
        if (tab) {
          this.selectTab(tab);
        }
      });
  }

  loadRuleArticles() {
    this.legislation.getRuleArticles(this.ruleId).subscribe(articles => {
      this.tabs.set(articles);
      if (!articles || !articles.length) return;

      const index = this.getInitialTabIndex();
      this.selectedTabIndex = index;

      const tab = articles[index];
      if (tab) {
        this.selectTab(tab);
      }
    });
  }

  loadRule() {
    this.legislation.getRuleById(this.ruleId).subscribe(rule => {
      this.selectedRule = rule;
    });
  }


  selectTab(tab: IArticle) {
    if (!tab.progress) {
      if (this.topicId) this.progress.getProgressByTopic(this.courseId, this.topicId, tab.id);
      else this.progress.getProgressByRule(this.ruleId, tab.id);
    } else {
      this.progress.setSelectedArticleProgress(tab.progress)
    }

    this.articleId = tab.id || 0;
    this.ruleId = tab.rule?.id || 0;
    this.getArticle();
  }

  getArticle(): void {
    if (this.articleId !== 0)
      this.legislation
        .getArticle(this.articleId)
        .subscribe(article => {
          this.article.set(article);
          if (article) {
            const ids: number[] = [];
            if (article.id)
              ids.push(article.id)
            this.store.dispatch(setSelectedArticle(article))
            this.store.dispatch(setAllSelectedArticles(ids))
          }

          this.selectedRule = article.rule || null;

          if (this.selectedRule)
            this.store.dispatch(setSelectedRule(this.selectedRule))
          this.paragraphs.set(article.versions[0].paragraphs);
        });
  }

  resetArticle() {
    this.progress.resetCurrentArticleProgress();
  }

  updateFrontTabProgress() {
    const tabs = this.tabs();
    if (!tabs) return;

    const pro = this.progress.selectedArticleProgress();
    if (!pro) return;

    const updated = tabs.map(t =>
      t.id === this.articleId
        ? { ...t, progress: pro }
        : t
    );

    this.tabs.set(updated);
  }

  goToNextTab() {
    const tabs = this.tabs();
    if (!tabs) return;
    const currentIndex = tabs.findIndex(t => t.id === this.articleId);

    if (currentIndex === -1) return;
    this.updateFrontTabProgress();

    const nextIndex = currentIndex + 1;
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;

    this.selectedTabIndex = nextIndex;

    this.selectTab(nextTab);
  }

  private getInitialTabIndex(): number {
    const tabs = this.tabs();
    if (!tabs) return 0;
    const firstIncomplete = tabs.findIndex(
      a => a.progress?.percentage !== 100
    );
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  }

  handleEntityCreationInput(value: string) {
    this.entityToCreate.set(value);
  }
}