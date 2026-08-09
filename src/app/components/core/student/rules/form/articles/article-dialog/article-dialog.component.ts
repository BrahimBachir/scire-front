import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { IArticle } from 'src/app/common/models/interfaces';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconModule } from 'src/app/icon/icon.module';
import { TopicStrategy } from 'src/app/strategies';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, toDoc, toHTML, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-article-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    IconModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
  ],
  templateUrl: './article-dialog.component.html',
  styleUrl: './article-dialog.component.scss',
  providers: [
    TopicStrategy
  ]
})
export class ArticleDialogComponent implements OnInit {
  form!: FormGroup;
  mode: 'CREATING' | 'EDITING';

  editor!: Editor;

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right'],
    ['undo', 'redo']
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'CREATING' | 'EDITING', element?: IArticle },
    private dialogRef: MatDialogRef<ArticleDialogComponent>,
    private fb: FormBuilder
  ) {
    this.mode = data.mode;
  }

  ngOnInit() {
    this.editor = new Editor();



    this.form = this.fb.group({
      id: [this.data.element?.id || null],
      title: [this.data.element?.title || '', Validators.required],
      content: [this.data.element?.content || '', Validators.required],
    });
    // If editing, convert HTML → editor doc
    const html = this.form.get('content')?.value;
    if (html) {
      this.form.get('content')?.setValue(toDoc(html));
    }

    // Convert editor doc → HTML automatically
    this.form.get('content')?.valueChanges.subscribe(value => {
      if (value && typeof value !== 'string') {
        this.form.get('content')?.setValue(toHTML(value), { emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.editor)
      this.editor.destroy();
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
