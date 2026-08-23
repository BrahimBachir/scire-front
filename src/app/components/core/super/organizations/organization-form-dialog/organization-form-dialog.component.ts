import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { IconModule } from 'src/app/icon/icon.module';
import { IOrganization } from 'src/app/common/models/interfaces';
import { OrganizationsService } from 'src/app/services';

export interface OrganizationFormDialogData {
  organization?: IOrganization;
}

@Component({
  selector: 'app-organization-form-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    IconModule,
  ],
  templateUrl: './organization-form-dialog.component.html',
})
export class OrganizationFormDialogComponent {
  loading = false;
  error: string | null = null;
  readonly isEditing: boolean;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OrganizationFormDialogData,
    private dialogRef: MatDialogRef<OrganizationFormDialogComponent>,
    private organizationsService: OrganizationsService,
  ) {
    this.isEditing = !!this.data.organization;
    this.form = new FormGroup({
      description: new FormControl<string>(this.data.organization?.description ?? '', {
        nonNullable: true,
        validators: Validators.required,
      }),
      icon: new FormControl<string | null>(this.data.organization?.icon ?? null),
      active: new FormControl<boolean>(this.data.organization?.active ?? true, { nonNullable: true }),
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const raw = this.form.getRawValue();
    const request$ = this.isEditing
      ? this.organizationsService.update({ id: this.data.organization!.id, ...raw })
      : this.organizationsService.create(raw);

    request$
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => this.dialogRef.close(result ?? true),
        error: () => (this.error = 'No se ha podido guardar la organización.'),
      });
  }
}
