import { Component, signal, effect, model } from '@angular/core';
import { ActivatedRoute, NavigationStart } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
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
import { IArticle, IArticleProgress, IArticleVersion, IBlock, IBlockArticles, IParagraph, IRule, IRuleIndex, IAllArticlesProgress, STEP_FIELD_MAP, IUser, IFieldMode } from 'src/app/common/models/interfaces';
import { ArticleProgressFacade, LegislationService, TopicService } from 'src/app/services';
import { AppCreateGenericElementComponent } from '../common/create-generic-element/create-generic-element.component';
import { QuestionComponent } from '../common/question/question.component';
import { SchemeNavigationComponent } from '../common/scheme/navigation/scheme-navigation.component';
import { VideoComponent } from '../common/video/display/video.component';
import { FlashcardNavigationComponent } from "../common/flashcard/navigation/flashcard-navigation.component";
import { CourseProgressService } from 'src/app/services/course-progress.service';
import { ArticleTabsComponent } from './article-tabs/article-tabs.component';
import { ArticleStepperComponent } from './article-stepper/article-stepper.component';
import { buildTabsFromBlocks } from './utils/build-tabs-from-blocks.util';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { selectLogedUser } from 'src/app/common/store/selectors';
import { setAllSelectedArticles, setSelectedArticle, setSelectedRule } from 'src/app/common/store/actions';
@Component({
  selector: 'app-topic-content',
  templateUrl: './topic-content.component.html',
  imports: [
    MatCardModule,
    TablerIconsModule,
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
    /* VideoComponent,
    QuestionComponent,
    SchemeNavigationComponent,
    FlashcardNavigationComponent */
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

    effect(() => {
      const tabs = this.tabs();
      if (! tabs || !tabs.length) return;


      const index = this.getInitialTabIndex();
      this.selectedTabIndex = index;

      const tab = tabs[index];
      if (tab) {
        this.selectTab(tab);
      }
    });

    this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      this.progress.flushIfDirty();
    }
  });

  }

  loadTabs(){
    if (this.topicId) this.loadTopicArticles();
    else this.loadRuleArticles();
  }

  loadTopicArticles(){
    this.topicService.getArticles(this.topicId, {courseId: this.courseId}).subscribe(articles => {
        this.tabs.set(articles);
    });
  }

  loadRuleArticles(){
    this.legislation.getRuleArticles(this.ruleId).subscribe(articles => {
        this.tabs.set(articles);
    });
  }

  loadRule() {
    this.legislation.getRuleById(this.ruleId).subscribe(rule => {
      this.selectedRule = rule;
      this.progress.loadForRule(rule.id);
    });
  }


  selectTab(tab: IArticle) {
    this.progress.flushIfDirty();
    this.articleId = tab.id || 0;
    this.ruleId = tab.rule?.id || 0;
    this.getArticle();
  }

  getArticle(): void {
    this.legislation
      .getArticle(this.articleId)
      .subscribe(article => {
        this.article.set(article);
        if(article){
          this.store.dispatch(setSelectedArticle(article))
          this.store.dispatch(setAllSelectedArticles([article]))
        }
        this.selectedRule = article.rule || null;
        if(this.selectedRule)
          this.store.dispatch(setSelectedRule(this.selectedRule))
        this.paragraphs.set(article.versions[0].paragraphs);
        if(!this.article()?.progress)
          this.getOneArticleProgress();
      });
  }

  getOneArticleProgress() {
    const progress: IArticleProgress = {
      articleId: this.articleId,
      userId: this.loggedUser()?.id || 0,
    }

    if (this.courseId === 0 || this.topicId === 0 || this.articleId === 0)
      progress.ruleId = this.selectedRule?.id;
    else {
      progress.courseId = this.courseId;
      progress.topicId = this.topicId;
    }

    this.progress.loadArticleProgress(progress);
  }

  resetArticle() {
    this.progress.resetCurrentArticleProgress();
  }

  goToNextTab() {
    const tabs = this.tabs();
    if(!tabs) return;
    const currentIndex = tabs.findIndex(t => t.id === this.articleId);
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + 1;
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;

    this.selectedTabIndex = nextIndex;

    this.selectTab(nextTab);
  }

  private getInitialTabIndex(): number {
    const tabs = this.tabs();
    if(!tabs) return 0;
    const firstIncomplete = tabs.findIndex(
      a => a.progress?.articleProgress !== 100
    );
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  }

  handleEntityCreationInput(value: string) {
    this.entityToCreate.set(value);
  }

}
/* export class AppTopicContentComponent {
  article = signal<IArticle | null>(null);
  versions = signal<IArticleVersion[] | null>(null);
  paragraphs = signal<IParagraph[] | null>(null);
  selectedTabIndex = 0;
  currentStepIndex = 0;
  selectedRule: IRule | null = null;
  private progressDirty = false;

  ruleCode: string = '';
  artiCode: string = '';
  showActions: boolean = false;

  tabs: IRuleIndex[] = [];
  rowRuleIndex: IRuleIndex[] = [];

  topicId: number = 0;
  courseId: number = 0;
  blocks: IBlock[] = [];
  rules: string[] = [];
  articles: IBlockArticles[] = [];
  courseDetail = signal<any>(null);
  favorite: boolean = false;
  joined: boolean = false;
  featureToCreate: string = '';
  favorite_class: string = 'star';
  user_class: string = 'user-x';
  articlesProgress = signal<IAllArticlesProgress | null>(null);
  selectedArticleProgress = signal<IArticleProgress | null>(null);


  constructor(
    activatedRouter: ActivatedRoute,
    private router: Router,
    private legislationService: LegislationService,
    private courseProgressService: CourseProgressService,
    private topicService: TopicService,
  ) {
    this.topicId = Number(activatedRouter?.snapshot?.paramMap?.get('topicId')) || 0;
    this.courseId = Number(activatedRouter?.snapshot?.paramMap?.get('courseId')) || 0;
    if (this.topicId)
      this.getTopicBllocks();
    else {
      this.ruleCode = activatedRouter?.snapshot?.paramMap?.get('ruleCode') || '';
      this.getRuleInformation();
    }
  }

  getRuleInformation() {
    this.legislationService.getRuleByCode(this.ruleCode).subscribe({
      next: (data) => {
        this.selectedRule = data;
        this.getIndexForRule();
        this.getRuleArticlesProgress();
      }
    });
  }

  getTopicBllocks() {
    this.topicService.getBlocks(this.topicId).subscribe({
      next: (data) => {
        this.blocks = data.rows as IBlock[];
        this.getIndexForTopic();
        this.getCourseArticlesProgress();
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['']);
  }

  onTabChange(tabIndex: any) {
    this.selectedTabIndex = tabIndex;
  }

  createElement(feature: string) {
    this.featureToCreate = feature;
  }

  goToNextTab(stepper: any, currentTabIndex: number): void {
    const nextIndex = currentTabIndex + 1;

    if (nextIndex < this.tabs.length) {
      stepper.reset();
      this.selectedTabIndex = nextIndex;

      const nextTab = this.tabs[nextIndex];
      this.getArticle(nextTab);

      this.currentStepIndex = 0;
    }
  }

  getArticleProgressStatus(code: string): string {
    const aps = this.articlesProgress();
    if (aps) {
      const articleProgress = aps.articles.find(a => a.artiCode === code);
      if (articleProgress) {
        return articleProgress.articleProgress?.toString() || '0';
      }
    }
    return '0';
  }

  getOneArticleProgress(artiCode: string) {
    const progress: IArticleProgress = {
      artiCode
    }

    if (this.courseId === 0 || this.topicId === 0 || artiCode === '')
      progress.ruleId = this.selectedRule?.id;
    else {
      progress.courseId = this.courseId;
      progress.topicId = this.topicId;
    }

    this.courseProgressService.create(progress).subscribe((progress) => {
      this.selectedArticleProgress.set(progress);
      this.progressDirty = false;
      this.setInitialStep();
    })

  }

  getCourseArticlesProgress() {
    this.courseProgressService.getCourseArticlesProgress({ courseId: this.courseId, topicId: this.topicId }).subscribe((res) => {
      this.articlesProgress.set(res)
    })
  }

  getRuleArticlesProgress() {
    this.courseProgressService.getRuleArticlesProgress({ ruleId: this.selectedRule?.id }).subscribe((res) => {
      this.articlesProgress.set(res)
    })
  }

  onStepChange(event: any) {
    const label = event.previouslySelectedStep.label;
    this.markStepCompleted(label);
    this.currentStepIndex = event.selectedIndex;
  }

  private markStepCompleted(label: string): void {
    const field = STEP_FIELD_MAP[label];
    if (!field) return;

    const progress = this.selectedArticleProgress();
    if (!progress) return;

    if (progress[field] === true) return;

    this.selectedArticleProgress.set({
      ...progress,
      [field]: true
    });

    console.log("Progress: ",this.selectedArticleProgress())
    this.progressDirty = true;
  }
  
  
  updateProgressIfNeeded(): void {
    if (!this.progressDirty) return;
    
    const progress = this.selectedArticleProgress();
    if (!progress) return;
    let newProgress: IArticleProgress = {
      id: progress?.id || 0,
      artiCode: progress.artiCode,
      text_reviewed: progress.text_reviewed,
      video_reviewed: progress.video_reviewed,
      diagrams_reviewed: progress.diagrams_reviewed,
      flashcards_reviewed: progress.flashcards_reviewed,
      questions_reviewed: progress.questions_reviewed,
    }
    
    console.log("Progress to be updated: ",progress)
    this.courseProgressService.update(newProgress).subscribe((progress) => {
      console.log("Just updated progress: ", progress)
      this.progressDirty = false;
    })
  }

  getArticle(tab: IRuleIndex) {
    this.updateProgressIfNeeded();
    this.artiCode = tab.id;

    if (!tab.ruleCode && this.ruleCode !== tab.url?.split('/')[7] || '')
      this.ruleCode = tab.url?.split('/')[7] || '';

    this.legislationService.getArticle({ ruleCode: this.ruleCode, artiCode: this.artiCode }).subscribe({
      next: (data) => {
        const arti = data;
        this.article.set(arti);
        this.versions.set(arti.versions || null)
        this.paragraphs.set(JSON.parse(arti.versions[0].paragraphs) as IParagraph[])
        this.getOneArticleProgress(arti.boeId ?? '');
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }
  reset(): void {

  }

  getIndexForRule(): void {
    this.tabs = [];
    this.tabs = this.selectedRule?.boeIndex?.filter(item => item.id.startsWith("a")) || [];
    this.getArticle({ id: this.tabs[0].id, ruleCode: this.ruleCode });
  }

  getIndexForTopic(): void {
    this.tabs = [];
    this.blocks.forEach(block => {
      if (block.articles && block.articles.length > 0) block.articles.forEach(article => {
        this.articles.push(article);
      });

      const articleCodesSet = this.getArticleCodesSet(block.rule?.code || '');

      if (articleCodesSet.size === 0) {
        return;
      }

      const newTabs = block.rule?.boeIndex?.filter(item => {
        item.ruleCode = block.rule?.code;
        const startsWithA = item.id.startsWith("a");
        const isInArticles = articleCodesSet.has(item.id);

        return startsWithA && isInArticles;
      });
      if (newTabs)
        this.tabs = this.tabs.concat(newTabs);

    });
    this.artiCode = this.articles[0].code;
    this.ruleCode = this.articles[0].ruleCode;
    this.getArticle({ id: this.articles[0].code, ruleCode: this.articles[0].ruleCode });
  }

  private getArticleCodesSet(ruleCode: string): Set<string> {
    const articleCodes = new Set<string>();
    this.articles
      .filter(article => article.ruleCode === ruleCode)
      .forEach(article => articleCodes.add(article.code));
    return articleCodes;
  }

  setInitialStep(): void {
    const steps = [
      this.selectedArticleProgress()?.text_reviewed,
      this.selectedArticleProgress()?.video_reviewed,
      this.selectedArticleProgress()?.diagrams_reviewed,
      this.selectedArticleProgress()?.flashcards_reviewed,
      this.selectedArticleProgress()?.questions_reviewed
    ];

    const firstIncompleteIndex = steps.findIndex(step => step === false);

    this.currentStepIndex =
      firstIncompleteIndex === -1
        ? steps.length
        : firstIncompleteIndex;
  }
} */
