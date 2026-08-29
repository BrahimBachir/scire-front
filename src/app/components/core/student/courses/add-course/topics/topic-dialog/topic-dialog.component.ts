import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CreateDialogData, ITopic, IFieldMode } from 'src/app/common/models/interfaces';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { IconModule } from 'src/app/icon/icon.module';
import { TopicStrategy } from 'src/app/strategies';
import { AssociatedCategoryFilterComponent } from "src/app/components/generic/filters/associated-category/associated-category-filter.component";
import { AssociatedSectionFilterComponent } from "src/app/components/generic/filters/associated-section/associated-section-filter.component";
import { TopicFilterComponent } from "src/app/components/generic/filters/topic/topic-filter.component";
import { BlockFormComponent } from '../blocks/block-form.component';

@Component({
  selector: 'app-topic-dialog', 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    IconModule,
    AssociatedCategoryFilterComponent,
    AssociatedSectionFilterComponent,
    TopicFilterComponent,
  ],
  templateUrl: './topic-dialog.component.html',
  styleUrl: './topic-dialog.component.scss',
  providers: [
    TopicStrategy
  ]
})
export class TopicDialogComponent {

  form!: FormGroup;
  loading = false;
  error: string | null = null;
  mode: IFieldMode;

  blocksComponent = BlockFormComponent;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateDialogData,
    private dialogRef: MatDialogRef<TopicDialogComponent>,
    private strategy: TopicStrategy,
  ) { }

  ngOnInit() {
    this.mode = this.data.mode;
    if (this.mode === 'EDITING' || this.mode === 'CREATING')
      this.form = this.strategy.buildForm(this.data.element as ITopic, this.data.courseId);
    else
      this.form = this.strategy.buildCourseTopicForm(undefined, this.data.courseId);

    this.submit = () => {
      this.loading = true;
      this.error = null;

      if (this.mode === 'EDITING' || this.mode === 'CREATING')
        this.strategy.submit(this.form)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: result => {
            this.dialogRef.close(result);
          },
          error: () => this.error = 'Error al guardar el exercicio'
        });
      else
        this.strategy.addToCourse(this.form)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: result => {
            this.dialogRef.close(result);
          },
          error: () => this.error = 'Error al guardar el exercicio'
        }); 
    };

  }

getBlocksArray(): FormArray {
  return this.form.get('blocks') as FormArray;
}

  toCreateMode() {
    this.mode = 'CREATING';
      this.form = this.strategy.buildForm(this.data.element as ITopic, this.data.courseId);
  }

  toSelectMode() {
    this.mode = 'SELECTING';
    this.form = this.strategy.buildCourseTopicForm(undefined, this.data.courseId);
  }

  submit!: () => void;

  ngOnDestroy() {
  }
}