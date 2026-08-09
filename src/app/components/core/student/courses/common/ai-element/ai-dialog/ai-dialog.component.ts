import { Component, Inject, inject, Injector, Type } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CREATE_STRATEGY_MAP, CreateDialogData, FEATURE_COMPONENT_MAP, FeatureType, GenericFeatureType, IFieldMode, IFlashcard, IQuestion, IRule, IDiagram } from 'src/app/common/models/interfaces';
import { RuleFilterComponent } from 'src/app/components/generic/filters/rule/rule-filter.component';
import { AppMultiSelectComponent } from 'src/app/components/generic/reusable/multi-select/multi-select.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize, Subject } from 'rxjs';
import { AIStrategy, FeatureStrategy, QuestionStrategy, FlashcardStrategy } from 'src/app/strategies';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { IconModule } from 'src/app/icon/icon.module';
import { AiFormComponent } from '../ai-element-create.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';

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
    IconModule,
    RuleFilterComponent,
    AppMultiSelectComponent,
    AiFormComponent,
    MatProgressBarModule
  ],
  templateUrl: './ai-dialog.component.html',
  styleUrl: './ai-dialog.component.scss',
  providers: [
    QuestionStrategy,
    FlashcardStrategy,
    AIStrategy
  ]
})
export class AIDialogComponent {
  private store = inject(Store<AppState>);
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  featureForm!: FormGroup;
  commonForm!: FormGroup;
  loading = false;
  creatingAIElement: boolean = false;
  aiResponseRecived = false;
  error: string | null = null;
  mode: IFieldMode = 'CREATING';
  selectedRule: IRule | null = null;
  feature: FeatureType | GenericFeatureType;
  featureComponent!: Type<any>;
  strategy!: FeatureStrategy;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateDialogData,
    private dialogRef: MatDialogRef<AIDialogComponent>,
    private injector: Injector,
    private mainStrategy: AIStrategy,
    
    private router: Router,
    private activatedRouter: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.mode = this.data.mode;

    this.commonForm = new FormGroup({
      ruleId: new FormControl<number | null>(this.data.rule?.id || this.data.ruleId || null),
      articlesIds: new FormControl<number[]>(this.data.articlesIds ?? []),
    })

    this.form = this.mainStrategy.buildForm({ ruleId: this.data?.ruleId ?? undefined, articlesIds: this.data.articlesIds ?? [], featureType: '' });
    console.log(this.form)

    this.aiSubmit = () => {
      this.creatingAIElement = true;
      this.aiResponseRecived = false;
      this.error = null;


      this.mainStrategy.submit(this.form)
        .pipe(finalize(() => {
          this.creatingAIElement = false;
          this.aiResponseRecived = true;
        }))
        .subscribe({
          next: result => {
            console.log("AI Response: ", result);
            if(this.feature !== 'DIAGRAM')
              this.buildFearuteForm(result[0]);
            else
              this.dialogRef.close(result[0]);
              //this.createDiagram(result[0] as IDiagram);
          },
          error: () => this.error = 'Error al generar al crear elemento con IA'
        });
    };

    this.submit = () => {
      this.loading = true;
      this.error = null;

      this.commonForm.get('ruleId')?.setValue(this.form.get('ruleId')?.value);
      this.commonForm.get('articlesIds')?.setValue(this.form.get('articlesIds')?.value);

      this.strategy.submit(this.featureForm, this.commonForm)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: result => this.dialogRef.close(result),
          error: () => this.error = 'Error al guardar elemento!'
        });
    };
  }

  aiSubmit!: () => void;
  submit!: () => void;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  buildFearuteForm(element: IDiagram | IFlashcard | IQuestion) {
    this.featureComponent = FEATURE_COMPONENT_MAP[this.feature as GenericFeatureType];

    const Strategy = CREATE_STRATEGY_MAP.get(this.feature)!;
    this.strategy = this.injector.get(Strategy);

    if (!this.featureComponent) {
      throw new Error(`No component registered for feature: ${this.feature}`);
    }

    this.featureForm = this.strategy.buildForm(element);

  }

  buildFeatForm(feat: any) {
    this.feature = feat.toUpperCase() as GenericFeatureType;
    this.form.get('featureType')?.setValue(feat);
  }
}
