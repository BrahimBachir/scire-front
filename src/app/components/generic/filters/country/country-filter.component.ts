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
import { ICountry } from 'src/app/common/models/interfaces';
import { BaseFilterDirective } from 'src/app/common/directives';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from 'src/app/icon/icon.module';
import { GeoService } from 'src/app/services';

@Component({
  selector: 'app-country-filter',
  templateUrl: './country-filter.component.html',
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
export class CountryFilterComponent extends BaseFilterDirective<ICountry> {
  private service = inject(GeoService);

  loadData(): void {
    this.service.getCountries().subscribe(data => {
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
