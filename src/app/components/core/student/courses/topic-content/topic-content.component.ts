import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { IArticle, IBlock, IBlockArticles, IRate, IRule, IRuleIndex } from 'src/app/common/models/interfaces';
import { LearningService, LegislationService, TopicService } from 'src/app/services';
import { AppCreateGenericElementComponent } from '../common/create-generic-element/create-generic-element.component';
import { FlashcardComponent } from '../common/flashcard/flashcard.component';
import { QuestionComponent } from '../common/question/question.component';
import { SchemeViewComponent } from '../common/scheme/scheme-view.component';
import { VideoComponent } from '../common/video/video.component';
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
    VideoComponent,
    FlashcardComponent,
    QuestionComponent,
    SchemeViewComponent,
    AppCreateGenericElementComponent
  ],
  styleUrl: 'topic-content.component.scss'
})
export class AppTopicContentComponent {
  article: IArticle | null = null;
  selectedTabIndex = 0;
  currentStepIndex = 0;
  selectedRule: IRule | null = null;

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


  constructor(
    activatedRouter: ActivatedRoute,
    private router: Router,
    private legislationService: LegislationService,
    private topicService: TopicService,
  ) {
    this.topicId = Number(activatedRouter?.snapshot?.paramMap?.get('topicId')) || 0;
    if (this.topicId)
      this.getTopicBllocks();
    else {
      console.log("The alternative")
      this.ruleCode = activatedRouter?.snapshot?.paramMap?.get('ruleCode') || '';
      this.getRuleInformation();
    }
  }

  getRuleInformation() {
    this.legislationService.getRuleByCode(this.ruleCode).subscribe({
      next: (data) => {
        this.selectedRule = data;
        this.getIndexForRule();
      }
    });
  }

  getTopicBllocks() {
    this.topicService.getBlocks(this.topicId).subscribe({
      next: (data) => {
        this.blocks = data.rows as IBlock[];
        this.getIndexForTopic();
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
    console.log(tabIndex)
    this.selectedTabIndex = tabIndex;
  }

  createElement(feature: string) {
    this.featureToCreate = feature;
  }

  changeSelectedArticle(tabIndex: any) {
    console.log(tabIndex)

    let index = this.tabs.indexOf(tabIndex)
    if (index >= this.tabs.length)
      this.selectedTabIndex = index + 1
  }


  onStepChange(event: any) {
    this.currentStepIndex = event.selectedIndex;
  }

  getArticle(tab: IRuleIndex) {
    this.artiCode = tab.id;

    if (!tab.ruleCode && this.ruleCode !== tab.url?.split('/')[7] || '')
      this.ruleCode = tab.url?.split('/')[7] || '';

    this.legislationService.getArticle({ ruleCode: this.ruleCode, artiCode: this.artiCode }).subscribe({
      next: (data) => {
        this.article = data;
        this.article.versions[0].paragraphs = JSON.parse(data.versions[0].paragraphs.toString());
        console.log("Article seted: ", this.article)
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
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
}
