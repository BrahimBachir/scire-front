import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { IArticle } from 'src/app/common/models/interfaces';
import { TranslateModule } from '@ngx-translate/core';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ArticleDialogComponent } from './article-dialog/article-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTable, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-rule-articles',
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    TranslateModule,
    MatTooltipModule
  ],
  templateUrl: './rule-articles.component.html',
  styleUrl: './rule-articles.component.scss',
})
export class RuleArticlesComponent {
  @Input() articles!: FormArray; // Received from Parent

  private dialog = inject(MatDialog);
  @ViewChild(MatTable) table!: MatTable<any>;

  displayedColumns: string[] = ['description', 'content', 'actions'];

  create() {
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      data: { mode: 'CREATING' },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: IArticle) => {
      if (result) {
        this.articles.push(new FormGroup({
          id: new FormControl(result.id),
          description: new FormControl(result.description),
          book: new FormControl(result.book),
          title: new FormControl(result.title),
          chapter: new FormControl(result.chapter),
          section: new FormControl(result.section),
          subsection: new FormControl(result.subsection),
          content: new FormControl(result.content)
        }));
        this.table.renderRows();
      }
    });
  }

  update(index: number) {
    const article = this.articles.at(index).value;
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      data: { mode: 'EDITING', element: article },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: IArticle) => {
      if (result) {
        this.articles.at(index).patchValue(result);
        this.table.renderRows();
      }
    });
  }

  remove(index: number) {
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.articles.removeAt(index);
        this.table.renderRows();
      }
    });
  }

  trackByFn(index: number, item: any): any {
    return item.value?.id || index;
  }
}
