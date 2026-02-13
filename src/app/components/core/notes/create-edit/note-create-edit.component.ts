import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, Toolbar, toHTML, toDoc } from 'ngx-editor';
import { FeatureFormComponent } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-note-create-edit',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './note-create-edit.component.html',
  styleUrl: './note-create-edit.component.scss'
})
export class NoteFormComponent implements OnInit, FeatureFormComponent {
  @Input({ required: true }) form!: FormGroup;

  
  editor!: Editor;

  ngOnInit(): void {
    this.editor = new Editor();

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
    if(this.editor)
      this.editor.destroy();
  }

  selectColor(color: string): void {
    this.form.get('color')?.setValue(color);
  }

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

  colors = [
    { colorName: 'primary' },
    { colorName: 'warning' },
    { colorName: 'secondary' },
    { colorName: 'error' },
    { colorName: 'success' },
  ];
}