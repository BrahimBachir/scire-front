import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, model, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, Toolbar, Validators, toHTML, toDoc } from 'ngx-editor';
import { FeatureFormComponent, IArticle, INote, IRule, IUser } from 'src/app/common/models/interfaces';
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
/* export class NoteFormComponent implements OnInit, OnChanges {
  private service = inject(NoteService);
  private store = inject(Store<AppState>)
  private newItem: INote | null = null;

  @Input() rule = signal<IRule | null>(null);
  selectedArticlesIds = model<string[] | null>(null);

  @Input() ruleCode!: string;
  @Input() artiCode!: string;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  //@Input() selectedNote = signal<INote | null>(null);
  selectedNote = model<INote | null>(null);
  
  selectedColor = signal<string | null>(null);

  logedUser!: IUser;

  html = '';
  editor: Editor;

  form = new FormGroup({
    editorContent: new FormControl<any>(null, [Validators.required()]),
    noteFavorite: new FormControl(false),
  });

  saveNote() {
    const note = this.selectedNote();
    if (!note)
      this.createNote();
    else
      this.updateNote(note);
  }

  createNote(){
    let content: any = this.f.editorContent.value;
    const html = toHTML(content);
    let favorite: boolean | undefined | null = this.form.get('noteFavorite')?.value;
    const rule = this.rule();
    this.newItem = {
      content: html,
      favorite: favorite,
      color: this.selectedColor(),
      ruleId: rule?.id || null,
      articles: this.selectedArticlesIds(),
      creatorId: this.logedUser.id,
    }
    this.service.create(this.newItem).subscribe({
      next: (savedNote) => {
        this.closeDialog.emit();
      },
      //error: (error) => console.error(error)
    })
  }

  updateNote(note: INote) {
    let content: any = this.f.editorContent.value;
    const html = toHTML(content);
    let favorite: boolean | undefined | null = this.form.get('noteFavorite')?.value;

    const newItem: INote = {
      //...note,
      content: html,
      favorite: favorite,
      color: this.selectedColor(),
      rule: this.rule(),
      articles: this.selectedArticlesIds(),
      creator: note.creator,
    }

    this.service.update(note?.id || 0, newItem).subscribe({
      next: (savedNote) => {
        this.closeDialog.emit();
      },
      //error: (error) => console.error(error)
    })
  }

  ngOnInit(): void {
    this.editor = new Editor();
    const note = this.selectedNote();
    if (note) {
      this.form = new FormGroup({
        editorContent: new FormControl(null),
        noteFavorite: new FormControl(false)
      });

      this.rule.set(note.rule ?? null);
      this.selectedArticlesIds.set(note.articles ?? null);
      this.f.noteFavorite.setValue(note.favorite || false)
      this.selectedColor.set(note.color || '')
      this.setEditorContentFromHtml(note.content);
    }
    this.store.select(selectLogedUser).subscribe(user => this.logedUser = user)
  }

  get f() {
    return this.form.controls;
  }

  private setEditorContentFromHtml(html?: string | null): void {
    if (!html) {
      return;
    }

    const jsonDoc = toDoc(html);

    this.form.get('editorContent')?.setValue(jsonDoc);
  }

  ngOnDestroy(): void {
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
} */

