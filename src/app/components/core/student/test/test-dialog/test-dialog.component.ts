import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import {
  CreateDialogData,
  IExercise,
  IFieldMode,
  ITest,
  ITestType,
} from 'src/app/common/models/interfaces';
import { TestTypeCode } from 'src/app/common/enums';
import { TestService } from 'src/app/services/test.service';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconModule } from 'src/app/icon/icon.module';
import { TestTypeFilterComponent } from 'src/app/components/generic/filters/test-type/test-type-filter.component';
import { TopicCategoryFilterComponent } from 'src/app/components/generic/filters/topic-category/topic-category-filter.component';
import { TopicSectionFilterComponent } from 'src/app/components/generic/filters/topic-section/topic-section-filter.component';
import { TopicFilterComponent } from 'src/app/components/generic/filters/topic/topic-filter.component';
import { TestStrategy } from 'src/app/strategies/test.strategy';
import { finalize } from 'rxjs';
import { DifficultyFilterComponent } from 'src/app/components/generic/filters/difficulty/difficulty-filter.component';
import { ExerciceFilterComponent } from 'src/app/components/generic/filters/exercise/exercise-filter.component';
import { ExerciseService } from 'src/app/services/exercise.service';
import { TopicMultiSelectComponent } from 'src/app/components/generic/filters/multi-topic/multi-topic-select.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-test-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    IconModule,
    TopicCategoryFilterComponent,
    TopicSectionFilterComponent,
    TestTypeFilterComponent,
    DifficultyFilterComponent,
    ExerciceFilterComponent,
    TopicMultiSelectComponent,
    TranslateModule,
  ],
  templateUrl: './test-dialog.component.html',
  styleUrl: './test-dialog.component.scss',
  providers: [TestStrategy],
})
export class TestDialogComponent implements OnInit {
  exeService = inject(ExerciseService);
  testService = inject(TestService);
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  mode: IFieldMode = 'CREATING';

  exercise = signal<IExercise | null>(null);
  testTypes: ITestType[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateDialogData,
    private dialogRef: MatDialogRef<TestDialogComponent>,
    private strategy: TestStrategy,
  ) {
    this.mode = data.mode;
  }

  ngOnInit() {
    this.form = this.strategy.buildForm(
      this.data.courseId || 0,
      this.data.element as ITest,
    );

    if (this.data.element?.id) {
      this.mode = 'EDITING';
    }

    this.testService.getTypes().subscribe((types) => {
      this.testTypes = types;

      if (this.data.element?.id) {
        const element = this.data.element;
        const typeId =
          element &&
          'typeId' in element &&
          typeof (element as ITest).typeId === 'number'
            ? (element as ITest).typeId
            : 0;
        this.buildFormBasedOnTestType(typeId);
      }
    });

    this.submit = () => {
      this.loading = true;
      this.error = null;

      this.strategy
        .submit(this.form)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (result) => {
            this.dialogRef.close(result);
          },
          error: (err: HttpErrorResponse) =>
            (this.error =
              err.error?.message ?? 'Error al guardar el exercicio'),
        });
    };

    this.form.get('typeId')?.valueChanges.subscribe((id) => {
      this.buildFormBasedOnTestType(id);
    });
  }

  buildFormBasedOnTestType(id?: number) {
    if (!id) {
      this.clearForm();
      return;
    }

    const code = this.testTypes.find((type) => type.id === id)?.code;

    switch (code) {
      case TestTypeCode.DEFINITIONS:
        this.setDefinitionReview();
        break;
      case TestTypeCode.DEADLINES:
        this.setDeadlineReview();
        break;
      case TestTypeCode.MOCK:
        this.setMockExam();
        break;
      case TestTypeCode.SYLLABUS:
        this.setSyllabusReview();
        break;
    }
  }

  submit!: () => void;

  getExercise(id: number) {
    this.exeService.getOne(id).subscribe({
      next: (exercise) => {
        this.form.get('num_questions')?.setValue(exercise.questions_number);
      },
    });
  }

  setDefinitionReview() {
    this.form.get('exerciseId')?.setValue(null, { emitEvent: false });
    this.form.get('exerciseId')?.disable();
  }

  setDeadlineReview() {
    this.form.get('exerciseId')?.disable({ emitEvent: false });
    this.form.get('categoryId')?.disable();
    this.form.get('num_questions')?.setValidators([Validators.required]);
    this.form
      .get('num_questions')
      ?.updateValueAndValidity({ emitEvent: false });
    this.form.get('difficultyId')?.setValidators(null);
    this.form.get('difficultyId')?.updateValueAndValidity({ emitEvent: false });
  }

  setMockExam() {
    this.form.get('exerciseId')?.valueChanges.subscribe((id) => {
      if (id) this.getExercise(id);
      else {
        this.exercise.set(null);
        this.form.get('num_questions')?.setValue(null);
      }
    });
    this.form.get('timed')?.setValue(true);
    this.form.get('categoryId')?.disable({ emitEvent: false });
    this.form.get('sectionId')?.disable({ emitEvent: false });
    this.form.get('topicsIds')?.disable({ emitEvent: false });
    this.form.get('num_questions')?.disable({ emitEvent: false });
    this.form.get('timed')?.disable({ emitEvent: false });
    this.form.get('creatorId')?.disable({ emitEvent: false });
    this.form.get('courseId')?.disable({ emitEvent: false });
    this.form.get('difficultyId')?.disable({ emitEvent: false });
  }

  setSyllabusReview() {
    this.form.get('exerciseId')?.setValue(null, { emitEvent: false });
    this.form.get('exerciseId')?.disable();
    this.form.get('exerciseId')?.setValidators(null);
    this.form.get('exerciseId')?.updateValueAndValidity({ emitEvent: false });

    this.form.get('num_questions')?.setValidators([Validators.required]);
    this.form
      .get('num_questions')
      ?.updateValueAndValidity({ emitEvent: false });
    this.form.get('difficultyId')?.setValidators([Validators.required]);
    this.form.get('difficultyId')?.updateValueAndValidity({ emitEvent: false });
  }

  clearForm() {
    this.form.get('categoryId')?.setValue(null);
    this.form.get('categoryId')?.enable();
    this.form.get('sectionId')?.setValue(null);
    this.form.get('topicsIds')?.setValue(null);
    this.form.get('num_questions')?.setValue(null);
    this.form.get('num_questions')?.enable();
    this.form.get('timed')?.setValue(null);
    this.form.get('timed')?.enable();
    this.form.get('creatorId')?.setValue(null);
    this.form.get('creatorId')?.enable();
    this.form.get('exerciseId')?.setValue(null);
    this.form.get('exerciseId')?.enable();
    this.form.get('difficultyId')?.setValue(null);
    this.form.get('difficultyId')?.enable();
  }
}
