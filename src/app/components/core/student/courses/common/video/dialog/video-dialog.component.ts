import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CreateDialogData, IFieldMode, IVideo } from 'src/app/common/models/interfaces';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { IconModule } from 'src/app/icon/icon.module';
import { VideoStrategy } from 'src/app/strategies';
import { VideoFormComponent } from '../form/video-form.component';
import { AppArticleFilterComponent } from 'src/app/components/generic/filters/article/article-filter.component';
import { RuleFilterComponent } from 'src/app/components/generic/filters/rule/rule-filter.component';
import { TimeInputComponent } from 'src/app/components/generic/reusable/time-input/time-input.component';

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
    AppArticleFilterComponent,
    RuleFilterComponent,
    TimeInputComponent
  ],
  templateUrl: './video-dialog.component.html',
  styleUrl: './video-dialog.component.scss',
  providers: [
    VideoStrategy
  ]
})
export class VideoDialogComponent {

  form!: FormGroup;
  articles_features!: FormArray;
  loading = false;
  error: string | null = null;
  mode: IFieldMode;

  videosComponent = VideoFormComponent;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateDialogData,
    private dialogRef: MatDialogRef<VideoDialogComponent>,
    private strategy: VideoStrategy,
  ) { }

  ngOnInit() {
    this.mode = this.data.mode;
    if (this.mode === 'EDITING')
      this.form = this.strategy.buildForm(this.data.element as IVideo);
    else
      this.form = this.strategy.buildForm();

    console.log(this.form);

    if (this.mode === 'CREATING')
      this.form.get('ruleId')?.setValue(this.data.ruleId);

    this.articles_features = this.form.get('articles_features')?.value as FormArray;

    this.onAddRow()

    this.submit = () => {
      this.loading = true;
      this.error = null;

      if (this.mode === 'EDITING' || this.mode === 'CREATING')
        this.strategy.submit(this.form)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: result => {
              this.dialogRef.close(result);
              console.log("Result: ", result)
            },
            error: () => this.error = 'Error al guardar el exercicio'
          });
    };

  }

  get articlesFeatures(): FormArray {
    return this.form.get('articles_features') as FormArray;
  }

  onAddRow(): void {
    const newAF = new FormGroup({
      articleId: new FormControl(null, Validators.required),
      startSeconds: new FormControl(null),
      endSeconds: new FormControl(null),
    });
    (this.form.get('articles_features') as FormArray)?.push(newAF) ;
  }

  onRemoveRow(rowIndex: number): void {
    (this.form.get('articles_features') as FormArray)?.removeAt(rowIndex);
  }
  submit!: () => void;

  ngOnDestroy() {
  }
}