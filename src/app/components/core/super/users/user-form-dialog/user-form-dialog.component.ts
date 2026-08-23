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
import { IGender, IOrganization, IRole, IUser } from 'src/app/common/models/interfaces';
import { UsersService } from 'src/app/services';
import { Roles } from 'src/app/common/enums/roles.enum';

// Roles whose accounts belong to an Organization — mirrors the backend's
// UserService.provisionUser() org-scoping rules.
const ORGANIZATION_ROLES: string[] = [Roles.ADMIN, Roles.INSTRUCTOR, Roles.STUDENT];

export interface UserFormDialogData {
  user?: IUser;
  roles: IRole[];
  genders: IGender[];
  // Only populated (and the org picker only shown) when the caller is
  // SUPER — an ADMIN provisioning INSTRUCTOR/STUDENT never picks an org,
  // the backend always forces their own regardless of what's submitted.
  organizations?: IOrganization[];
  currentUserRoleCode?: string | null;
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
  readonly showOrganizationPicker: boolean;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserFormDialogData,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    private usersService: UsersService,
  ) {
    this.isEditing = !!this.data.user;
    this.showOrganizationPicker = this.data.currentUserRoleCode === Roles.SUPER;
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

    if (this.showOrganizationPicker) {
      // The user list this dialog is opened from doesn't eager-load the
      // `organization` relation (only the plain organizationId column), so
      // resolve the pre-selected option by id against the org list instead.
      const initialOrganization =
        this.data.organizations?.find(o => o.id === this.data.user?.organizationId) ??
        this.data.user?.organization ??
        null;
      this.form.addControl('organization', new FormControl<IOrganization | null>(initialOrganization));
    }
  }

  compareById(a: IRole | IGender | IOrganization | null, b: IRole | IGender | IOrganization | null): boolean {
    return a?.id === b?.id;
  }

  // Only SUPER (showOrganizationPicker) ever sees this field, and only for
  // roles that actually belong to an Organization — an ADMIN provisioning
  // INSTRUCTOR/STUDENT never sees it at all, the backend forces their own
  // org regardless of what's submitted (see UserService.provisionUser()).
  isOrganizationRole(role: IRole | null): boolean {
    return !!role?.code && ORGANIZATION_ROLES.includes(role.code);
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const { organization, ...raw } = this.form.getRawValue();
    const payload = this.showOrganizationPicker
      ? { ...raw, organizationId: organization?.id }
      : raw;

    const request$ = this.isEditing
      ? this.usersService.updateUser({ id: this.data.user!.id, ...payload })
      : this.usersService.provisionUser(payload);

    request$
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (result) => this.dialogRef.close(result ?? true),
        error: () => this.error = 'No se ha podido guardar el usuario.',
      });
  }
}
