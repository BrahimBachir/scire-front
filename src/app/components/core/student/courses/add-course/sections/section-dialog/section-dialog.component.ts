import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { IFieldMode } from 'src/app/common/models/interfaces';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { IconModule } from 'src/app/icon/icon.module';
import { LearningService } from 'src/app/services';
import { AssociatedCategoryFilterComponent } from 'src/app/components/generic/filters/associated-category/associated-category-filter.component';
import { TopicSectionFilterComponent } from 'src/app/components/generic/filters/topic-section/topic-section-filter.component';

export interface SectionDialogData {
  courseId: number;
}

@Component({
  selector: 'app-section-dialog',
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
    TopicSectionFilterComponent,
  ],
  templateUrl: './section-dialog.component.html',
})
export class SectionDialogComponent {
  mode: IFieldMode = 'SELECTING';
  loading = false;
  error: string | null = null;

  selectForm = new FormGroup({
    categoryId: new FormControl<number | null>(null, Validators.required),
    sectionId: new FormControl<number | null>(null, Validators.required),
  });

  createForm = new FormGroup({
    categoryId: new FormControl<number | null>(null, Validators.required),
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SectionDialogData,
    private dialogRef: MatDialogRef<SectionDialogComponent>,
    private service: LearningService,
  ) {}

  get form(): FormGroup {
    return this.mode === 'CREATING' ? this.createForm : this.selectForm;
  }

  toCreateMode(): void {
    this.mode = 'CREATING';
  }

  toSelectMode(): void {
    this.mode = 'SELECTING';
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const request$ = this.mode === 'CREATING'
      ? this.service.createSection({
          name: this.createForm.getRawValue().name,
          category: { id: this.createForm.getRawValue().categoryId! },
          courseId: this.data.courseId,
        })
      : this.service.associateSectionToCourse(this.data.courseId, this.selectForm.getRawValue().sectionId!);

    request$
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (result) => this.dialogRef.close(result),
        error: () => this.error = 'Error al guardar la sección',
      });
  }
}