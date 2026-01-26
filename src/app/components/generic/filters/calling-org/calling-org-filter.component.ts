import { Component, effect, EventEmitter, forwardRef, inject, Input, input, model, OnInit, Output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
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
import { ICaller, IFieldMode } from 'src/app/common/models/interfaces';

@Component({
  selector: 'calling-org-filter',
  templateUrl: './calling-org-filter.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CallerFilterComponent),
    multi: true,
  }],
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

export class CallerFilterComponent implements ControlValueAccessor, OnInit {
  private service = inject(CourseService);
  @Output() valueChange = new EventEmitter<number | null>();
  @Input() mode: IFieldMode = 'FILTERING'; //type IFieldMode = "EDITING" | "CREATING" | "FILTERING"

  control = new FormControl<ICaller | string | null>(null);

  items: ICaller[] = [];
  filteredItems: ICaller[] = [];

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
    const selected = event.option.value as ICaller;
    this.value = selected.id;
    this.valueChange.emit(selected.id);
    this.onChange(this.value);
    this.onTouched();
  }

  displayName = (entity: ICaller | string | null): string =>
    typeof entity === 'object' && entity ? entity.description : '';

  private getItems(): void {
    this.service.getCaller().subscribe(data => {
      this.items = data;
      this.filteredItems = data;

      this.applyCurrentValue();
    });
  }

  private filter(value: ICaller | string | null): ICaller[] {
    const text =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.description.toLowerCase() || '';

    return this.items.filter(i =>
      i.description.toLowerCase().includes(text)
    );
  }

  clean() {
    //this.control.setValue(null, { emitEvent: false });
    this.control.reset(null, { emitEvent: false });
    this.filteredItems = [...this.items];
    this.valueChange.emit(null);
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

/* export class CallerFilterComponent implements OnInit {

  private service = inject(CourseService);

  protected items = signal<ICaller[]>([]);
  protected filteredItems = signal<ICaller[]>([]);
  selectedItem = model<ICaller | null>(null);

  @Output() selected: EventEmitter<ICaller> = new EventEmitter<ICaller>();
  editable = input<boolean>(true);
  filtering = input<boolean>(true);
  required = input<boolean>(false);

  protected control = new FormControl<ICaller | string>('');

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
      next: (value) => { if (value === '') this.selectedItem.set(null) }
    })

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
    this.getItems();
    if (this.required())
      this.control.setValidators((control) => control.value ? null : { required: true });

  }

  getItems(): void {
    this.service.getCaller().subscribe({
      next: (data) => {
        this.items.set(data);
        if (this.filtering())
          this.items().unshift(this.all)
        this.filteredItems.set(this.items());
      },
      //error: (err) => console.error('Error fetching categories:', err),
    });
  }

  private _getFilterValue(value: ICaller | string | null): string {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value && value.description) {
      return value.description.toLocaleLowerCase();
    }
    return '';
  }

  private _filter(value: ICaller | string | null): ICaller[] {
    const filterValue = this._getFilterValue(value);
    return this.items().filter((item) => item.description?.toLowerCase().includes(filterValue));
  }


  displayName = (entity: ICaller | string | null): string => {
    return (entity && typeof entity !== 'string' && entity.description) ? entity.description : (entity as string || '');
  };

  onSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as ICaller;
    this.selectedItem.set(selected);
    this.selected.emit(selected);
  }

  all: ICaller = {
    id: 0,
    code: 'ALL',
    description: 'Todas',
    icon: '',
  }
}
 */