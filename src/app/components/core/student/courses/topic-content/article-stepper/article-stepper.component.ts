import {
  Component,
  ChangeDetectionStrategy,
  Input,
  effect,
  Output,
  EventEmitter,
  signal,
  output,
  ViewChild,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { IArticleProgress, IArticle } from 'src/app/common/models/interfaces';
import { FlashcardNavigationComponent } from '../../common/flashcard/navigation/flashcard-navigation.component';
import { QuestionComponent } from '../../common/question/question.component';
import { VideoComponent } from '../../common/video/display/video.component';
import { ArticleContentComponent } from '../article-content/article-content.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DiagramNavigationComponent } from '../../common/diagram/navigation/diagram-navigation.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ArticleProgressFacade } from 'src/app/services';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { setSelectedArticle } from 'src/app/common/store/actions';

@Component({
  selector: 'app-article-stepper',
  templateUrl: './article-stepper.component.html',
  imports: [
    CommonModule,
    MatStepperModule,
    VideoComponent,
    QuestionComponent,
    DiagramNavigationComponent,
    FlashcardNavigationComponent,
    ArticleContentComponent,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleStepperComponent implements OnChanges {
  @ViewChild('stepper') stepper!: MatStepper;
    //@Input() article = signal<IArticle | null>(null);
    @Input() progressFacade!: ArticleProgressFacade;
  @Input() article!: IArticle | null;
  @Input() lastArticle: boolean = false;
  @Input() firstArticle: boolean = false;
  @Input() isInitialLoad: boolean = true; // State tracker

  @Output() resetRequested = new EventEmitter<void>();
  @Output() nextArticleRequested = new EventEmitter<void>();
  @Output() previousArticleRequested = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<keyof IArticleProgress>();
  entityToCreate = output<string>();
  sequential: boolean = false;

  @Input() currentStepIndex = 0;

  private readonly stepFields: (keyof IArticleProgress)[] = [
    'text_reviewed',
    'video_reviewed',
    'diagrams_reviewed',
    'flashcards_reviewed',
    'questions_reviewed',
  ];

  readonly STEP_MAP: Record<string, keyof IArticleProgress> = {
    text: 'text_reviewed',
    videos: 'video_reviewed',
    diagrams: 'diagrams_reviewed',
    flashcards: 'flashcards_reviewed',
    questions: 'questions_reviewed',
  };

    constructor(
        private store: Store<AppState>
    ) {
  }

  ngOnDestroy() {
    this.stepper.reset();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['article']) {
      this.isInitialLoad = true;
      this.onArticleChanges();
    }
  }

  resetStepper() {
    this.currentStepIndex = 0;
    this.resetRequested.emit();
  }

  cleanStepper() {
    this.currentStepIndex = 0;
  }

  goNextArticle() {
    this.nextArticleRequested.emit();
  }

  goPreviousArticle() {
    this.previousArticleRequested.emit();
  }

  onStepChange(event: StepperSelectionEvent) {
    this.currentStepIndex = event.selectedIndex;
    const label = event.previouslySelectedStep?.label;
    let field = this.STEP_MAP[label];
    if (field) {
        field = field.trimStart().trimEnd() as keyof IArticleProgress;
        if (field && this.article && this.article?.progress) {
          this.progressFacade
            .completStep(this.article.progress, field)
              ?.subscribe((pro) => {
                this.article = { ...this.article!, progress: pro };
                this.progressFacade.setSelectedArticleProgress(pro);
                this.store.dispatch(setSelectedArticle(this.article));
                this.progressFacade.isDirty.set(true);  
              });
        }
      //this.nextStep.emit(field);
    }
  }

  onArticleChanges() {
    if (!this.article || !this.article?.progress) return;

      if (this.isInitialLoad) {
      const firstIncomplete = this.stepFields.findIndex(
        (field) => this.article?.progress?.[field] === false,
      );

      this.currentStepIndex =
        firstIncomplete === -1 ? this.stepFields.length : firstIncomplete;

      this.isInitialLoad = false;
    }
  }

  handleEntityCreationOutput(value: string) {
    this.entityToCreate.emit(value);
  }

  get progress() {
    return this.article?.progress;
  }

  get ruleId() {

    return this.article?.ruleId ?? 0;
  }

  get articleId() {
    return this.article?.id ?? 0;
  }

  get content() {
    return this.article?.content ?? '';
  }
}
