import {
  Component,
  forwardRef,
  inject,
  Input,
  input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { CourseService } from 'src/app/services';
import { ICourseStatus, IFieldMode } from 'src/app/common/models/interfaces';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'course-status-filter',
  templateUrl: './course-status-filter.component.html',
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CourseStatusFilterComponent),
      multi: true,
    },
  ],
})
export class CourseStatusFilterComponent implements ControlValueAccessor, OnInit {
  private service = inject(CourseService);
  @Input({ required: true }) mode: IFieldMode = 'FILTERING';


  control = new FormControl<ICourseStatus | string | null>(null);

  items: ICourseStatus[] = [];
  filteredItems: ICourseStatus[] = [];

  private value: number | null = null;
  private onChange: (value: number | null) => void = () => { };
  onTouched: () => void = () => { };

  ngOnInit(): void {
    this.getItems();

    this.control.valueChanges
      .pipe(startWith(''), debounceTime(200))
      .subscribe(value => {
        this.filteredItems = this.filter(value);
      });
  }

  writeValue(value: number | null): void {
    this.value = value;
    const selected = this.items.find(s => s.id === value) || null;
    this.control.setValue(selected, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.control.disable({ emitEvent: false })
      : this.control.enable({ emitEvent: false });
  }

  onSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as ICourseStatus;
    this.value = selected.id;
    this.onChange(this.value);
    this.onTouched();
  }

  displayName = (entity: ICourseStatus | string | null): string =>
    typeof entity === 'object' && entity ? entity.description : '';

  private getItems(): void {
    this.service.getStatuses().subscribe(data => {
      this.items = data;
      this.filteredItems = data;

      this.applyCurrentValue();
    });
  }

  private filter(value: ICourseStatus | string | null): ICourseStatus[] {
    const text =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.description.toLowerCase() || '';

    return this.items.filter(i =>
      i.description.toLowerCase().includes(text)
    );
  }

  clean() {
    this.control.reset(null, { emitEvent: false });
    this.filteredItems = [...this.items];
  }

  private applyCurrentValue(): void {
    if (this.value != null) {
      this.writeValue(this.value);
      return;
    }

    if (this.mode === 'CREATING') {
      const draft = this.items.find(s => s.code === 'DRAFT');
      if (draft) {
        this.control.setValue(draft, { emitEvent: false });
        this.onChange(draft.id);
      }
    }
  }

}


/* import { Component, effect, EventEmitter, inject, input, Input, model, OnInit, Output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CourseService } from 'src/app/services';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ICourseStatus } from 'src/app/common/models/interfaces';

@Component({
  selector: 'course-status-filter',
  templateUrl: './course-status-filter.component.html',
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
export class AppCourseStatusFilterComponent implements OnInit {
  private router = inject(Router);
  private service = inject(CourseService);

  protected items = signal<ICourseStatus[]>([]);
  protected filteredItems = signal<ICourseStatus[]>([]);
  selectedItem = model<ICourseStatus | null>(null);
  incomingItemId = input<number | null>(null);
  @Output() selected: EventEmitter<ICourseStatus> = new EventEmitter<ICourseStatus>();
  editable = input<boolean>(true);
  filtering = input<boolean>(true);
  required = input<boolean>(true);
  isEditMode = model<boolean>(false);

  protected control = new FormControl<ICourseStatus | string>('');

  form!: FormGroup;

  constructor() {
    effect(() => {
      const items = this.items();
      const id = this.incomingItemId()
      const editing = this.isEditMode()

      if(editing && !id) return;
      //if(this.isEditMode()) return;

      if(editing) {
        this.selectedItem.set(items.find(s => s.id === id) || null);
        return
      }

      this.selectedItem.set(items.find(s => s.code === 'DRAFT') || null);
    })
    effect(() => {

      const item = this.selectedItem();

      if (!this.isEditMode) {
        this.control.disable({ emitEvent: false });
        return;
      }
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

    this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredItems.set(this._filter(value));
    });
  }

  clean() {
    this.selectedItem.set(null);
    this.control.reset(null, { emitEvent: false });
    this.filteredItems.set(this.items());
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('new'))
      this.isEditMode.set(false);
    if (this.required())
      this.control.setValidators((control) => control.value ? null : { required: true });

    this.getItems();
  }

  getItems(): void {
    this.service.getStatuses().subscribe({
      next: (data) => {
        this.items.set(data);
        if (this.filtering())
          this.items().unshift(this.all)

        this.filteredItems.set(this.items());
      },
      //error: (err) => console.error('Error fetching categories:', err),
    });
  }

  private _getFilterValue(value: ICourseStatus | string | null): string {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value && value.description) {
      return value.description.toLocaleLowerCase();
    }
    return '';
  }

  private _filter(value: ICourseStatus | string | null): ICourseStatus[] {
    const filterValue = this._getFilterValue(value);
    return this.items().filter((item) => item.description.toLowerCase().includes(filterValue));
  }


  displayName = (entity: ICourseStatus | string | null): string => {
    return (entity && typeof entity !== 'string' && entity.description) ? entity.description : (entity as string || '');
  };

  onSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as ICourseStatus;
    this.selectedItem.set(selected);
    this.selected.emit(selected);
  }

  all: ICourseStatus = {
    id: 0,
    code: 'ALL',
    description: 'Todas'
  }
}
 */