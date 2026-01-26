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

@Component({
  selector: 'app-delete-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    TablerIconsModule,
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
