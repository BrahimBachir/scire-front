import { MatCardModule } from '@angular/material/card';
import { provideTablerIcons, TablerIconComponent } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CourseService } from 'src/app/services';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ICaller } from 'src/app/common/models/interfaces';
import { BaseFilterDirective } from 'src/app/common/directives';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'calling-org-filter',
  templateUrl: './calling-org-filter.component.html',
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
export class CallerFilterComponent extends BaseFilterDirective<ICaller> {
  private service = inject(CourseService);

  loadData(): void {
    this.service.getCaller().subscribe(data => {
      this.items = data;
      this.filteredItems = data;
      this.syncInternalControl();
    });
  }
}