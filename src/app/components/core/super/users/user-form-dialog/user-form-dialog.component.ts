import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { IconModule } from 'src/app/icon/icon.module';
import { IGender, IRole, IUser } from 'src/app/common/models/interfaces';
import { UsersService } from 'src/app/services';

export interface UserFormDialogData {
  user?: IUser;
  roles: IRole[];
  genders: IGender[];
}

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MaterialModule,
    MatDatepickerModule,
    IconModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './user-form-dialog.component.html',
})
export class UserFormDialogComponent {
  loading = false;
  error: string | null = null;
  readonly isEditing: boolean;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserFormDialogData,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    private usersService: UsersService,
  ) {
    this.isEditing = !!this.data.user;
    this.form = this.isEditing
      ? new FormGroup({
          birth_date: new FormControl<Date | null>(
            this.data.user?.birth_date ? new Date(this.data.user.birth_date) : null
          ),
          role: new FormControl<IRole | null>(this.data.user?.role ?? null, Validators.required),
          gender: new FormControl<IGender | null>(this.data.user?.gender ?? null, Validators.required),
          active: new FormControl<boolean>(this.data.user?.active ?? true, { nonNullable: true }),
        })
      : new FormGroup({
          name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
          first_surname: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
          second_surname: new FormControl<string | null>(null),
          email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
          birth_date: new FormControl<Date | null>(null),
          role: new FormControl<IRole | null>(null, Validators.required),
          gender: new FormControl<IGender | null>(null, Validators.required),
          active: new FormControl<boolean>(true, { nonNullable: true }),
        });
  }

  compareById(a: IRole | IGender | null, b: IRole | IGender | null): boolean {
    return a?.id === b?.id;
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const raw = this.form.getRawValue();
    const request$ = this.isEditing
      ? this.usersService.updateUser({ id: this.data.user!.id, ...raw })
      : this.usersService.provisionUser(raw);

    request$
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (result) => this.dialogRef.close(result ?? true),
        error: () => this.error = 'No se ha podido guardar el usuario.',
      });
  }
}
