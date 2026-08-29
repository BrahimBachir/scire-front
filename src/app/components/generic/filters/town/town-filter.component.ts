import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ITown } from 'src/app/common/models/interfaces';
import { BaseFilterDirective } from 'src/app/common/directives';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from 'src/app/icon/icon.module';
import { GeoService } from 'src/app/services';

@Component({
  selector: 'app-town-filter',
  templateUrl: './town-filter.component.html',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    IconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatAutocomplete,
  ],
})
export class TownFilterComponent extends BaseFilterDirective<ITown> {
  private service = inject(GeoService);

  // parentId here is the selected country's id: towns can't be loaded (or
  // picked) until a country is selected.
  loadData(): void {
    if (!this.parentId) {
      this.items = [];
      this.filteredItems = [];
      return;
    }

    this.service.getTowns(this.parentId).subscribe(data => {
      this.items = data;
      this.filteredItems = data;

      if (this.value != null) {
        this.syncInternalControl();
        return;
      }
      this.autoSelectIfSingleOption();
    });
  }
}
