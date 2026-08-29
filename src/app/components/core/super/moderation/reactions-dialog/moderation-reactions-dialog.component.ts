import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { ModerationService } from 'src/app/services';
import { IModerationReaction } from 'src/app/common/models/interfaces';

export interface ModerationReactionsDialogData {
  summary: string;
  reactions: IModerationReaction[];
}

@Component({
  selector: 'app-moderation-reactions-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    IconModule,
  ],
  templateUrl: './moderation-reactions-dialog.component.html',
})
export class ModerationReactionsDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ModerationReactionsDialogComponent>);
  readonly data: ModerationReactionsDialogData = inject(MAT_DIALOG_DATA);
  private moderationService = inject(ModerationService);

  protected reactions: IModerationReaction[] = [];
  protected index = 0;

  ngOnInit(): void {
    this.reactions = [...this.data.reactions];
    this.markCurrentRead();
  }

  get current(): IModerationReaction | null {
    return this.reactions[this.index] ?? null;
  }

  previous(): void {
    if (this.index === 0) return;
    this.index--;
    this.markCurrentRead();
  }

  next(): void {
    if (this.index >= this.reactions.length - 1) return;
    this.index++;
    this.markCurrentRead();
  }

  // Reading a comment just records that a moderator has seen it — it never
  // decides the item's fate, so the item stays in the queue (and the dialog
  // can be closed at any point) until an explicit resolve/discard action is
  // taken from the table.
  private markCurrentRead(): void {
    const reaction = this.current;
    if (!reaction || reaction.isRead) return;

    reaction.isRead = true;
    this.moderationService.readReaction(reaction.id).subscribe();
  }
}
