import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { OrganizationsService } from 'src/app/services';
import { IOrganization } from 'src/app/common/models/interfaces';
import { AppSearchTermFilterComponent } from 'src/app/components/generic/filters/search-term/search-term.component';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { AppBannersNotFoundComponent } from 'src/app/components/generic/banners/not-found/banner-not-found.component';
import { OrganizationFormDialogComponent } from './organization-form-dialog/organization-form-dialog.component';

@Component({
  selector: 'app-organization-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    IconModule,
    AppSearchTermFilterComponent,
    AppBannersNotFoundComponent,
  ],
  templateUrl: './organization-management.component.html',
})
export class AppOrganizationManagementComponent implements OnInit {
  private organizationsService = inject(OrganizationsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  protected organizations: IOrganization[] = [];
  protected total = 0;
  protected loading = false;
  protected pageIndex = 0;
  protected pageSize = 10;
  protected readonly pageSizeOptions = [10, 25, 50];
  protected readonly displayedColumns = ['description', 'active', 'actions'];

  protected searchControl = new FormControl<string | null>(null);

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadOrganizations();
    });

    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.loading = true;
    this.organizationsService
      .getAll({
        skip: this.pageIndex * this.pageSize,
        take: this.pageSize,
        searchTerm: this.searchControl.value ?? undefined,
      })
      .subscribe({
        next: (res) => {
          this.organizations = res.rows;
          this.total = res.total;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrganizations();
  }

  openCreateDialog(): void {
    this.dialog
      .open(OrganizationFormDialogComponent, { width: '600px', data: {} })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.showSnackbar('Organización creada.');
          this.loadOrganizations();
        }
      });
  }

  openEditDialog(organization: IOrganization): void {
    this.dialog
      .open(OrganizationFormDialogComponent, { width: '600px', data: { organization } })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.showSnackbar('Organización actualizada.');
          this.loadOrganizations();
        }
      });
  }

  deleteOne(organization: IOrganization): void {
    if (!organization.id) return;
    this.dialog
      .open(AppDeleteDialogComponent, { data: { ids: [organization.id] } })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'delete') {
          this.organizationsService.delete(organization.id!).subscribe(() => {
            this.showSnackbar('Organización eliminada.');
            this.loadOrganizations();
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
