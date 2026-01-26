import { Component, effect, EventEmitter, inject, input, model, OnInit, Output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CourseService } from 'src/app/services';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ICourseCategory } from 'src/app/common/models/interfaces';

@Component({
  selector: 'course-category-filter',
  templateUrl: './course-category-filter.component.html',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    TablerIconsModule,
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
export class AppCourseCategryFilterComponent implements OnInit {

  private service = inject(CourseService);

  protected items = signal<ICourseCategory[]>([]);
  protected filteredItems = signal<ICourseCategory[]>([]);
  selectedItem = model<ICourseCategory | null>(null);

  @Output() selected: EventEmitter<ICourseCategory> = new EventEmitter<ICourseCategory>();
  editable = input<boolean>(true);
  filtering = input<boolean>(true);
  required = input<boolean>(false);

  protected control = new FormControl<ICourseCategory | string>('');

  form!: FormGroup;

  constructor() {
    effect(() => {
      const item = this.selectedItem();

      if (item && !this.editable()) {
        this.control.disable({ emitEvent: false });
        this.control.setValue(item, { emitEvent: false });
      } else {
        this.control.enable({ emitEvent: false });
      }

      if (item) {
        this.control.setValue(item, { emitEvent: false });
      }
    });

    this.control.valueChanges.subscribe({ 
      next: (value) => {if(value === '') this.selectedItem.set(null)} 
    })

      this.control.valueChanges.pipe(
        startWith(''),
        debounceTime(200),
      ).subscribe(value => {
        this.filteredItems.set(this._filter(value));
      });
  }

  clean(){
    this.selectedItem.set(null);
    this.control.reset(null, { emitEvent: false });
    this.filteredItems.set(this.items());
  }

  ngOnInit(): void {
    this.getItems();
    if(this.required())
      this.control.setValidators((control) => control.value ? null : { required: true });

  }

  getItems(): void {
    this.service.getCategories().subscribe({
      next: (data) => {
        this.items.set(data);
        if(this.filtering())
          this.items().unshift(this.all)
        this.filteredItems.set(this.items());
      },
      //error: (err) => console.error('Error fetching categories:', err),
    });
  }

  private _getFilterValue(value: ICourseCategory | string | null): string {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value && value.description) {
      return value.description.toLocaleLowerCase();
    }
    return '';
  }

  private _filter(value: ICourseCategory | string | null): ICourseCategory[] {
    const filterValue = this._getFilterValue(value);
    return this.items().filter((item) => item.description?.toLowerCase().includes(filterValue));
  }


  displayName = (entity: ICourseCategory | string | null): string => {
      return (entity && typeof entity !== 'string' && entity.description) ? entity.description : (entity as string || '');
  };
  
  onSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as ICourseCategory;
    this.selectedItem.set(selected);
    this.selected.emit(selected);
  }

  all: ICourseCategory = {
    id: 0,
    code: 'ALL',
    description: 'Todas',
  }
}
