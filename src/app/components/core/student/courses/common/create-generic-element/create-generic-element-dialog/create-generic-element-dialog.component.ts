import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AppFlashcardCreateEditComponent } from '../../flashcard/create-edit/flashcard-create-edit.component';
import { AppSchemeCreateEditComponent } from '../../scheme/create-edit/scheme-create-edit.component';
import { AppVideoCreateEditComponent } from "../../video/create-edit/video-create-edit.component";
import { AppQuestionCreateEditComponent } from "../../ai-element/ai-element-create.component";
import { IArticle, IRule } from 'src/app/common/models/interfaces';
import { AppNoteCreateEditComponent } from 'src/app/components/core/notes/create-edit/note-create-edit.component';

@Component({
  selector: 'app-create-generic-element-dialog',
  imports: [
    //MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    TablerIconsModule,
    AppFlashcardCreateEditComponent,
    AppSchemeCreateEditComponent,
    AppVideoCreateEditComponent,
    AppNoteCreateEditComponent,
    AppQuestionCreateEditComponent
],
  templateUrl: './create-generic-element-dialog.component.html',
  styleUrl: './create-generic-element-dialog.component.scss',
})
export class CreateGenericElementDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateGenericElementDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  get feature(): string {
    return this.data.feature;
  }

  get rule(): IRule {
    return this.data.rule;
  }

  get article(): IArticle {
    return this.data.article;
  }
}
