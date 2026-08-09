import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CreateDialogData, IExercise, IFieldMode } from 'src/app/common/models/interfaces';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { IconModule } from 'src/app/icon/icon.module';
import { ExerciseStrategy } from 'src/app/strategies';
import { ExerciceTypeFilterComponent } from 'src/app/components/generic/filters/exercise-type/exercise-type-filter.component';
import { QuestionTypeFilterComponent } from 'src/app/components/generic/filters/question-type/question-type-filter.component';

@Component({
  selector: 'app-exercise-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    IconModule,
    ExerciceTypeFilterComponent,
    QuestionTypeFilterComponent,
  ],
  templateUrl: './exercise-dialog.component.html',
  styleUrl: './exercise-dialog.component.scss',
  providers: [
    ExerciseStrategy
  ]
})
export class ExerciseDialogComponent {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  mode: IFieldMode = 'CREATING';


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateDialogData,
    private dialogRef: MatDialogRef<ExerciseDialogComponent>,
    private strategy: ExerciseStrategy,
  ) { }

  ngOnInit() {
    if (this.data.element?.id)
      this.mode = 'EDITING';

    this.form = this.strategy.buildForm(this.data.element as IExercise, this.data.courseId);

    this.submit = () => {
      this.loading = true;
      this.error = null;

      this.strategy.submit(this.form)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: result => {
            this.dialogRef.close(result);
          },
          error: () => this.error = 'Error al guardar el exercicio'
        });
    };

  }

  submit!: () => void;
}