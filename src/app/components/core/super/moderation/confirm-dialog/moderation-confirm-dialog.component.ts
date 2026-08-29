import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

export interface ModerationConfirmDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: 'primary' | 'warn';
}

@Component({
  selector: 'app-moderation-confirm-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
  ],
  templateUrl: './moderation-confirm-dialog.component.html',
})
export class ModerationConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ModerationConfirmDialogComponent>);
  readonly data: ModerationConfirmDialogData = inject(MAT_DIALOG_DATA);

  confirm(): void {
    this.dialogRef.close(true);
  }
}
