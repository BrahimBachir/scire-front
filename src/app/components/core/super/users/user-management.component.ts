import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { GendersService, OrganizationsService, RoleService, UsersService } from 'src/app/services';
import { IGender, IOrganization, IRole, IUser } from 'src/app/common/models/interfaces';
import { AppSearchTermFilterComponent } from 'src/app/components/generic/filters/search-term/search-term.component';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { AppBannersNotFoundComponent } from 'src/app/components/generic/banners/not-found/banner-not-found.component';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { AppState } from 'src/app/common/store/app.store';
import { selectUserRole } from 'src/app/common/store/selectors/auth.selectors';
import { Roles } from 'src/app/common/enums/roles.enum';

// Mirrors the backend rule in UserService.assertRoleAssignable(): only SUPER
// may grant the SUPER role — an ADMIN's role picker never even shows it. The
// backend check is the real boundary; this is UX only.
const ADMIN_ASSIGNABLE_ROLES: string[] = [Roles.ADMIN, Roles.INSTRUCTOR, Roles.STUDENT];

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    IconModule,
    AppSearchTermFilterComponent,
    AppBannersNotFoundComponent,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class AppUserManagementComponent implements OnInit {
  private usersService = inject(UsersService);
  private roleService = inject(RoleService);
  private gendersService = inject(GendersService);
  private organizationsService = inject(OrganizationsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store<AppState>);

  private currentUserRoleCode: string | null = null;

  protected users: IUser[] = [];
  protected total = 0;
  protected loading = false;
  protected pageIndex = 0;
  protected pageSize = 10;
  protected readonly pageSizeOptions = [10, 25, 50];
  protected readonly displayedColumns = ['select', 'full_name', 'email', 'role', 'active', 'actions'];

  protected roles: IRole[] = [];
  protected genders: IGender[] = [];
  // Only fetched for a SUPER caller (GET /organizations is SUPER-only) — an
  // ADMIN provisioning INSTRUCTOR/STUDENT never picks an org, the backend
  // always forces their own regardless of what's submitted.
  protected organizations: IOrganization[] = [];
  protected selected = new Set<number>();

  protected searchControl = new FormControl<string | null>(null);

  ngOnInit(): void {
    this.store.select(selectUserRole).subscribe(role => {
      this.currentUserRoleCode = role?.code ?? null;
      if (this.currentUserRoleCode === Roles.SUPER) {
        this.organizationsService.getAll({ take: 1000 }).subscribe(res => this.organizations = res.rows);
      }
    });
    this.roleService.getAll().subscribe(roles => this.roles = roles);
    this.gendersService.getAll().subscribe(genders => this.genders = genders);

    this.searchControl.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadUsers();
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.getAllUsers({
      skip: this.pageIndex * this.pageSize,
      take: this.pageSize,
      searchTerm: this.searchControl.value ?? undefined,
    }).subscribe({
      next: (res) => {
        this.users = res.rows;
        this.total = res.total;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  get assignableRoles(): IRole[] {
    if (this.currentUserRoleCode === Roles.SUPER) return this.roles;
    return this.roles.filter(r => !!r.code && ADMIN_ASSIGNABLE_ROLES.includes(r.code));
  }

  primaryEmail(user: IUser): string {
    return user.emails?.[0]?.value ?? '-';
  }

  isSelected(id?: number): boolean {
    return !!id && this.selected.has(id);
  }

  toggleSelection(id?: number): void {
    if (!id) return;
    if (this.selected.has(id)) this.selected.delete(id);
    else this.selected.add(id);
  }

  isAllSelected(): boolean {
    return this.users.length > 0 && this.users.every(u => this.isSelected(u.id));
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.users.forEach(u => u.id && this.selected.delete(u.id));
    } else {
      this.users.forEach(u => u.id && this.selected.add(u.id));
    }
  }

  openCreateDialog(): void {
    this.dialog.open(UserFormDialogComponent, {
      width: '700px',
      data: {
        roles: this.assignableRoles,
        genders: this.genders,
        organizations: this.organizations,
        currentUserRoleCode: this.currentUserRoleCode,
      },
    }).afterClosed().subscribe(result => {
      if (result) {
        if (result.warning === 'EMAIL_DELIVERY_FAILED') {
          this.showSnackbar('Usuario creado, pero no se ha podido enviar el email con la contraseña.');
        } else {
          this.showSnackbar('Usuario creado. Se ha enviado la contraseña por email.');
        }
        this.loadUsers();
      }
    });
  }

  openEditDialog(user: IUser): void {
    this.dialog.open(UserFormDialogComponent, {
      width: '700px',
      data: {
        user,
        roles: this.assignableRoles,
        genders: this.genders,
        organizations: this.organizations,
        currentUserRoleCode: this.currentUserRoleCode,
      },
    }).afterClosed().subscribe(result => {
      if (result) {
        this.showSnackbar('Usuario actualizado.');
        this.loadUsers();
      }
    });
  }

  deleteOne(user: IUser): void {
    if (!user.id) return;
    this.dialog.open(AppDeleteDialogComponent, {
      data: { ids: [user.id] },
    }).afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.usersService.deleteUser(user.id!).subscribe(() => {
          this.showSnackbar('Usuario eliminado.');
          this.loadUsers();
        });
      }
    });
  }

  deleteSelected(): void {
    const ids = [...this.selected];
    if (!ids.length) return;
    this.dialog.open(AppDeleteDialogComponent, {
      data: { ids },
    }).afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.usersService.deleteManyUsers(ids).subscribe(() => {
          this.selected.clear();
          this.showSnackbar('Usuarios eliminados.');
          this.loadUsers();
        });
      }
    });
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
