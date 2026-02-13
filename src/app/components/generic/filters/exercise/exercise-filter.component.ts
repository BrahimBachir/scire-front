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
import { IExercise, IExerciseType } from 'src/app/common/models/interfaces';
import { BaseFilterDirective } from 'src/app/common/directives';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from 'src/app/icon/icon.module';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'exercise-filter',
  templateUrl: './exercise-filter.component.html',
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
export class ExerciceFilterComponent extends BaseFilterDirective<IExercise> {
  private service = inject(ExerciseService);

  loadData(): void {
    this.service.getAll().subscribe(data => {
      this.items = data;
      this.filteredItems = data;
      this.syncInternalControl();
    });
  }
}