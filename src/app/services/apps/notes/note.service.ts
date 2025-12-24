import { Injectable, signal } from '@angular/core';
import { OldNote } from 'src/app/components/core/notes/note';
import { notes } from 'src/app/components/core/notes/notesData';

@Injectable({
  providedIn: 'root',
})
export class OldNoteService {
  private notes = signal<OldNote[]>(notes);

  public getNotes(): OldNote[] {
    return this.notes();
  }

  public addNote(note: OldNote) {
    this.notes.update((currentNotes) => [note, ...currentNotes]);
  }

  public removeNote(note: OldNote) {
    this.notes.update((currentNotes) => currentNotes.filter((n) => n !== note));
  }

  public updateNote(updatedNote: OldNote): void {
    this.notes.update(
      (currentNotes) =>
        currentNotes.map((n) =>
          n.title === updatedNote.title ? updatedNote : n
        )
    );
  }
}
