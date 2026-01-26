import { Component, effect, Inject, inject, Injector, Input, OnInit, signal, Type } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { FlashcardFormComponent } from '../../flashcard/form/flashcard-form.component';
import { CREATE_STRATEGY_MAP, CreateDialogData, FEATURE_COMPONENT_MAP, FeatureType, GenericFeatureType, IArticle, IFieldMode, IFlashcard, INote, IQuestion, IRule } from 'src/app/common/models/interfaces';
import { NoteFormComponent } from 'src/app/components/core/notes/create-edit/note-create-edit.component';
import { RuleFilterComponent } from 'src/app/components/generic/filters/rule/rule-filter.component';
import { AppMultiSelectComponent } from 'src/app/components/generic/reusable/multi-select/multi-select.component';
import { capitalizeFirstLetter } from 'src/app/common/utils/capitalize-first-letter.util';
import { AiFormComponent } from '../../ai-element/ai-element-create.component';
import { AppArticleFilterComponent } from "src/app/components/generic/filters/article/article-filter.component";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionStrategy } from 'src/app/strategies/question.strategy';
import { finalize, Subject, takeUntil } from 'rxjs';
import { VideoFormComponent } from '../../video/form/video-form.component';
import { FeatureStrategy, FlashcardStrategy, NoteStrategy, VideoStrategy } from 'src/app/strategies';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { getSelectedRule } from 'src/app/common/store/selectors/learning.selectors';

@Component({
  selector: 'app-create-generic-element-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    TablerIconsModule,
    //FlashcardFormComponent,
    //VideoFormComponent,
    //NoteFormComponent,
    //AppQuestionCreateEditComponent,
    RuleFilterComponent,
    AppMultiSelectComponent,
    //AiFormComponent,
    //AppArticleFilterComponent
  ],
  templateUrl: './create-generic-element-dialog.component.html',
  styleUrl: './create-generic-element-dialog.component.scss',
  providers: [
    QuestionStrategy,
    VideoStrategy,
    NoteStrategy,
    FlashcardStrategy,
    //AiStrategy
  ]
})
export class CreateGenericElementDialogComponent {
  private store = inject(Store<AppState>);
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  loading = false;
  error: string | null = null;
  mode: IFieldMode = 'CREATING';
  feature: FeatureType;
  featureComponent!: Type<any>;
  strategy!: FeatureStrategy;
  selectedRule: IRule | null = null;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateDialogData,
    private dialogRef: MatDialogRef<CreateGenericElementDialogComponent>,
    private injector: Injector
  ) { }

  ngOnInit() {

    this.feature = this.data.feature as GenericFeatureType;
    this.featureComponent = FEATURE_COMPONENT_MAP[this.feature];

    const Strategy = CREATE_STRATEGY_MAP.get(this.feature)!;
    this.strategy = this.injector.get(Strategy);

    if (!this.featureComponent) {
      throw new Error(`No component registered for feature: ${this.feature}`);
    }

    this.form = new FormGroup({
      common: new FormGroup({
        ruleId: new FormControl<number | null>(this.data.rule?.id || this.data.ruleId || null),
        articlesIds: new FormControl<number[]>(this.data.articlesIds ?? []),
      }),
      feature: this.strategy.buildForm(this.data.element as any)
    });

    this.store.select(getSelectedRule).pipe(takeUntil(this.destroy$)).subscribe(rule => {
      this.selectedRule = rule ?? null;

      const articlesCtrl = (this.form.get('common.articlesIds') as FormControl<number[]>);
      const ruleCtrl = (this.form.get('common.ruleId') as FormControl<number[]>);
      if (!rule) {
        articlesCtrl.setValue([], { emitEvent: false });
        articlesCtrl.disable({ emitEvent: false });
      } else {
        articlesCtrl.enable({ emitEvent: false });
        ruleCtrl.disable({ emitEvent: false })
      }
    });
    this.mode = this.data.mode;

    this.submit = () => {
      this.loading = true;
      this.error = null;

      const commonForm = this.form.get('common') as FormGroup;
      const featureForm = this.form.get('feature') as FormGroup;

      const ruleCtrl = commonForm.get('ruleId') as FormControl<number | null>;
      const articlesCtrl = commonForm.get('articlesIds') as FormControl<number[]>;

      // disable initially if no rule
      if (!ruleCtrl.value) {
        articlesCtrl.disable({ emitEvent: false });
      }

      ruleCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(ruleId => {
        if (!ruleId) {
          // rule cleared → wipe and disable articles
          this.selectedRule = null;
          articlesCtrl.setValue([], { emitEvent: false });
          articlesCtrl.disable({ emitEvent: false });
          return;
        }

        articlesCtrl.enable({ emitEvent: false });

        articlesCtrl.setValue([], { emitEvent: false });
      });

      this.strategy.submit(featureForm, commonForm)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: result => this.dialogRef.close(result),
          error: () => this.error = 'Error al guardar la pregunta'
        });
    };
  }

  submit!: () => void;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
/* export class CreateGenericElementDialogComponent implements OnInit {
  //form!: FormGroup;
  modeToSend: IFieldMode = 'CREATING';
  @Input() isEditMode = false;

  readonly dialogRef = inject(MatDialogRef<CreateGenericElementDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  isArticleEditable: boolean;
  isRuleEditable: boolean;

  articleToPass = signal<IArticle | null>(null);
  articlesToDropDown = signal<string[] | null>(null);
  articlesFromDropDown = signal<string[] | null>(null);
  ruleToPass = signal<IRule | null>(null);

  noteToPass = signal<INote | null>(null);
  flashcardToPass = signal<IFlashcard | null>(null);
  questionToPass = signal<IQuestion | null>(null);

  form = this.fb.group({
    ruleId: this.fb.control<number | null>(null, Validators.required),
    articleId: this.fb.control<number | null>(null, Validators.required),
    articlesIds: this.fb.control<number[] | null>(null, Validators.required),
    flascard: this.fb.group({
      question: this.fb.control<string>('', { nonNullable: true, validators: Validators.required }),
      answer: this.fb.control<string>('', { nonNullable: true, validators: Validators.required }),
    }),
    video: this.fb.group({
      code: this.fb.control<string>('', { nonNullable: true, validators: Validators.required }),
      startSeconds: this.fb.control<number | null>(null),
      endSeconds: this.fb.control<number | null>(null),
    }),
    question: this.fb.group({
      id: this.fb.control<number | null>(null),
      text: this.fb.control<string>('', { nonNullable: true, validators: Validators.required }),
      explanation: this.fb.control<string>('', { nonNullable: true, validators: Validators.required }),
      difficulty: this.fb.control<number | null>(1),
      real: this.fb.control<boolean>(false),
    }),
    note: this.fb.group({
      details: this.fb.control<string | null>(null),
    })
  });

  constructor(
  ) {
    effect(() => {
      const selected = this.articlesFromDropDown();
    });
  }

  ngOnInit(): void {
    if(this.data.mode)
      this.modeToSend = this.data.mode;
    
    this.ruleToPass.set(this.data.rule?.element || this.data.element?.rule || null);
    this.articleToPass.set(this.data.article?.element || this.data.element?.article || null);
    this.articlesToDropDown.set(this.elementArticles || null)
    this.noteToPass.set(this.element as INote ?? null);
    this.flashcardToPass.set(this.element as IFlashcard ?? null);
    this.questionToPass.set(this.element as IQuestion ?? null);

    this.isRuleEditable = this.ruleEditable;
    this.isArticleEditable = this.articleEditable;


  }


  get action(): string {
    return capitalizeFirstLetter(this.data.action || '');
  }


  get feature(): string {
    return this.data.feature;
  }

  get element(): INote | IFlashcard | IQuestion {
    return this.data.element;
  }

  get articleEditable(): boolean {
    return this.data.article.isEditable;
  }

  get ruleEditable(): boolean {
    return this.data.rule.isEditable;
  }

  get elementArticles(): string[] {
    const ids: string[] = [];
    if (this.data.element !== null) {
      return this.data.element?.articles;
    } else {
      ids.push(this.data.article?.element?.boeId || '');
      return ids;
    }
  }
}
 */