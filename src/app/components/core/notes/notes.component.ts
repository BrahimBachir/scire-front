import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from 'src/app/services';
import { FilterConfig, FiltersOptions, INote, TernaryFilterConfig, IQueryingDto } from 'src/app/common/models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { CreateGenericElementDialogComponent } from '../student/courses/common/create-generic-element/create-generic-element-dialog/create-generic-element-dialog.component';
import { AppDeleteDialogComponent } from '../../generic/dialogs/delete-dialog/delete-dialog.component';
import { AppFiltersOrchestratorComponent } from '../../generic/filters/orchestrator/filters-orchestrator.component';
import { NoteFavoOptions, NoteFiltersData } from 'src/app/common/data/filters/note-filter-items';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  imports: [
    CommonModule,
    NgScrollbarModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    AppFiltersOrchestratorComponent,
    MatPaginatorModule,
  ]
})
export class AppNotesComponent implements OnInit {
  private service = inject(NoteService)
  private snackBar = inject(MatSnackBar)
  sidePanelOpened = signal(true);
  private dialog = inject(MatDialog)
  length!: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100]
  currentPageIndex: number = 0;
  firstLoad: boolean = true;

  filters!: IQueryingDto;

  noteFiltersConfig: FilterConfig[] = NoteFiltersData;

  favoriteFilterConfig: TernaryFilterConfig = {
    items: NoteFavoOptions,
    label: 'Favoritas'
  }

  filterOptions: FiltersOptions = {
    applyMode: 'auto',
    ternaryFilterConfig: this.favoriteFilterConfig,
    maxVisbleFields: 4
  }

  notes = signal<INote[]>([]);
  noteTitle = signal<any>('');

  selectedNote = signal<INote | null>(null);

  active = signal<boolean>(false);
  feature: string = 'NOTE';

  searchText = signal<any>('');

  clrName = signal<string>('warning');

  colors = [
    { colorName: 'primary' },
    { colorName: 'warning' },
    { colorName: 'secondary' },
    { colorName: 'error' },
    { colorName: 'success' },
  ];

  currentNoteTitle = signal<string>('');
  selectedColor = signal<string | null>(null);


  ngOnInit(): void {
    this.getNotes();
  }

  createNote() {
    const dialogRef = this.dialog.open(CreateGenericElementDialogComponent, {
      width: '70vw',
      data: {
        action: 'CREAR',
        feature: this.feature,
        rule: {
          isEditable: true,
          element: null
        },
        article: {
          isEditable: false,
          element: null
        },
        element: null
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getNotes();
    });
  }

  getNotes() {
    this.filters = {
      ...this.filters,
      take: this.pageSize,
      skip: this.pageSize * this.currentPageIndex
    }

    this.service.getAll(this.filters).subscribe({
      next: (res) => {
        this.notes.set(res.rows as INote[])
        this.length = res.total;
        this.selectedNote.set(this.notes()[0]);
        this.getTitle();
      },
      //error: (error) => console.error(error)
    })
  }

  get currentNote(): INote | null {
    return this.selectedNote();
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  onSelect(note: INote): void {
    this.selectedNote.set(note);
    this.selectedColor.set(note.color || '');
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

  deleteNote() {
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.service.delete(this.selectedNote()?.id || 0).subscribe({
          next: (res) => {
            this.getNotes();
            this.showSnackbar(res.message);
          },
          //error: (error) => console.error(error)
        })
      }
    });
  }

  editeNote() {
    const note = this.selectedNote();
    const dialogRef = this.dialog.open(CreateGenericElementDialogComponent, {
      data: {
        action: 'EDITAR',
        feature: this.feature,
        ruleId: note?.ruleId,
        articlesIds: note?.articlesIds,
        element: note
      },
      //autoFocus: true, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getNotes();
    });
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onFiltersChanged(filters: IQueryingDto) {
    this.filters = filters;
    this.getNotes();
  }

  onPageChange(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getNotes();
  }
}
