import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-delete-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    IconModule,
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
})
export class AppDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AppDeleteDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  get itemCount(): number {
    return this.data?.ids?.length ?? 1;
  }

  confirmDelete() {
    this.dialogRef.close('delete');
  }
}
