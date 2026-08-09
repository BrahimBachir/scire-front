import { Component, Inject, inject, Injector, Type } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CREATE_STRATEGY_MAP, CreateDialogData, FEATURE_COMPONENT_MAP, FeatureType, GenericFeatureType, IFieldMode, IRule } from 'src/app/common/models/interfaces';
import { RuleFilterComponent } from 'src/app/components/generic/filters/rule/rule-filter.component';
import { AppMultiSelectComponent } from 'src/app/components/generic/reusable/multi-select/multi-select.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionStrategy } from 'src/app/strategies/question.strategy';
import { finalize, Subject, takeUntil } from 'rxjs';
import { FeatureStrategy, FlashcardStrategy, NoteStrategy, VideoStrategy } from 'src/app/strategies';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { getSelectedRule } from 'src/app/common/store/selectors/learning.selectors';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-ai-dialog',
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
  selectedRule: IRule | null = null;
  feature: FeatureType;
  featureComponent!: Type<any>;
  strategy!: FeatureStrategy;


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

    console.log("Data: ", this.data)

    this.form = new FormGroup({
      common: new FormGroup({
        ruleId: new FormControl<number | null>(this.data.ruleId || null),
        articlesIds: new FormControl<number[]>(this.data.articlesIds ?? []),
      }),
      feature: this.strategy.buildForm(this.data.element as any)
    });

    const articlesCtrl = (this.form.get('common.articlesIds') as FormControl<number[]>);
    const ruleCtrl = (this.form.get('common.ruleId') as FormControl<number[]>);
    if (!this.data.ruleId) {
      articlesCtrl.setValue([], { emitEvent: false });
      articlesCtrl.disable({ emitEvent: false });
    } else {
      articlesCtrl.enable({ emitEvent: false });
      ruleCtrl.disable({ emitEvent: false })
    }

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
          error: () => this.error = 'Error al guardar el elemento'
        });
    };
  }

  submit!: () => void;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}