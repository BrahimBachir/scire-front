import { Component, inject, OnInit, signal } from '@angular/core';
import { OldNote } from './note';
import { OldNoteService } from 'src/app/services/apps/notes/note.service';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from 'src/app/services';
import { INote } from 'src/app/common/models/interfaces';
@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss'],
    imports: [
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ]
})
export class AppNotesComponent implements OnInit {
deleteNote() {
throw new Error('Method not implemented.');
}
editeNote() {
throw new Error('Method not implemented.');
}
  private service = inject(NoteService)
  sidePanelOpened = signal(true);

  notes = signal<INote[]>([]);
  oldNotes = signal<OldNote[]>([]);
  noteTitle = signal<any>('');

  selectedNote = signal<INote | null>(null);

  active = signal<boolean>(false);

  searchText = signal<any>('');

  clrName = signal<string>('warning');
  feature: string = 'FLASHCARD';

  colors = [
    { colorName: 'primary' },
    { colorName: 'warning' },
    { colorName: 'secondary' },
    { colorName: 'error' },
    { colorName: 'success' },
  ];

  currentNoteTitle = signal<string>('');
  selectedColor = signal<string | null>(null);

  constructor(public noteService: OldNoteService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.oldNotes.set(this.noteService.getNotes());
    this.getNotes();
  }

  getNotes(){
    this.service.getAll().subscribe({
      next: (res) => {
        this.notes.set(res.rows as INote[])
        this.selectedNote.set(this.notes()[0]);
        this.getTitle();
      },
      error: (error) => console.error(error)
    })
  }

  get currentNote(): INote | null {
    return this.selectedNote();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.oldNotes.set(this.filter(filterValue));
  }

  filter(v: string): OldNote[] {
    return this.noteService
      .getNotes()
      .filter((x) => x.title.toLowerCase().includes(v.toLowerCase()));
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  onSelect(note: INote): void {
    console.log(note)
    this.selectedNote.set(note);
    this.selectedColor.set(note.color ||'');
    this.getTitle();
  }

  getTitle() {
    this.notes().forEach((note) => {
      const textOnly = new DOMParser()
      .parseFromString(note.content, 'text/html')
      .body.textContent || '';
      
      note.title = textOnly.replace(/\s+/g, ' ').substring(0, 25) + '...';
    })
  }

  addNoteClick(): void {
    const newNote: OldNote = {
      color: this.clrName(),
      title: 'This is a new note',
      datef: new Date(),
    };
    this.noteService.addNote(newNote);
    this.oldNotes.set(this.noteService.getNotes());

    this.openSnackBar('OldNote added successfully!');
  }

  openSnackBar(
    message: string,
    action: string = 'Close',
    type: 'create' | 'delete' = 'create'
  ): void {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
