import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, Toolbar, Validators, toHTML } from 'ngx-editor';
import { IArticle, INote, IRule, IUser } from 'src/app/common/models/interfaces';
import { AppState } from 'src/app/common/store/app.store';
import { selectLogedUser } from 'src/app/common/store/selectors';
import { MaterialModule } from 'src/app/material.module';

import { NoteService } from 'src/app/services';

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
    TablerIconsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './note-create-edit.component.html',
  styleUrl: './note-create-edit.component.scss'
})
export class AppNoteCreateEditComponent implements OnInit, OnChanges {
  private service = inject(NoteService);
  private store = inject(Store<AppState>)
  private note: INote | null = null;

  @Input() rule!: IRule;
  @Input() article!: IArticle;

  @Input() ruleCode!: string;
  @Input() artiCode!: string;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  selectedNote = signal<INote | null>(null);
  selectedColor = signal<string | null>(null);

logedUser!: IUser;

  html = '';
  editor: Editor;

  form = new FormGroup({
    editorContent: new FormControl(null, [Validators.required()]),
    noteFavorite: new FormControl(false),
  });

  saveNote() {
    let content: any = this.form.get('editorContent')?.value;
    const html = toHTML(content);
    let favorite: boolean | undefined | null = this.form.get('noteFavorite')?.value;
    console.log('Printing HTLM:', this.html, this.form.get('editorContent')?.value)
    console.log('Content:', content)
    //this.note.color = this.selectedColor();
    //this.note.favourite = this.form.get('noteFavorite')?.value;
    this.note = {
      id: 0,
      content: html,
      favourite: favorite,
      color: this.selectedColor(),
      rule: this.rule,
      article: this.article,
      creator: this.logedUser,
    }
    this.service.create(this.note).subscribe({
      next: (savedNote) => {
        console.log(savedNote)
        this.closeDialog.emit();
      },
      error: (error) => console.error(error)
    })

  }

  ngOnInit(): void {
    this.editor = new Editor();
    console.log("PRint rule: ", this.rule);
    console.log("PRint article: ", this.article);
    this.store.select(selectLogedUser).subscribe(user => this.logedUser = user) 
  }

  ngOnDestroy(): void {
    console.log("This html: ", this.html)
    this.editor.destroy();
  }

  onSelectColor(colorName: string): void {
    this.selectedColor.set(colorName);
  }

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['indent'],
    ['undo', 'redo']
  ];

  //ngOnInit(): void {
  /*     this.service.getByRule(this.ruleCode, this.artiCode).subscribe({
        next: (data) => {
          console.log("Note from the server: ",data)
        },
        error: (error) => console.error(error) 
      }) */
  //}

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }

  colors = [
    { colorName: 'primary' },
    { colorName: 'warning' },
    { colorName: 'secondary' },
    { colorName: 'error' },
    { colorName: 'success' },
  ];
}
