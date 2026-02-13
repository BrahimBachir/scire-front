import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CourseService } from 'src/app/services';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { getDefaultCourseType, ICourseType } from 'src/app/common/models/interfaces';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { selectUserRole } from 'src/app/common/store/selectors';
import { BaseFilterDirective } from 'src/app/common/directives';
import { IconModule } from 'src/app/icon/icon.module';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'course-type-filter',
  templateUrl: './course-type-filter.component.html',
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
export class CourseTypeFilterComponent extends BaseFilterDirective<ICourseType> {
  roleCode: string = '';

  private service = inject(CourseService);
  store = inject(Store<AppState>).select(selectUserRole).subscribe( role => this.roleCode = role.code || '');

  loadData(): void {
    this.service.getTypes().subscribe(data => {
      this.items = data;
      this.filteredItems = data;
      this.applyCurrentValue();
    });
  }

  private applyCurrentValue(): void {
    if (this.value != null) {
      this.syncInternalControl();
      return;
    }

    if (this.mode !== 'FILTERING') {
      const type = this.items.find(s => s.code === getDefaultCourseType(this.roleCode));
      
      if (!type) return;
      
      this.writeValue(type.id);
      this.onChange(type.id);

      if (this.roleCode && this.roleCode !== 'SUPER')
        this.control.disable({ emitEvent: false });
    }
  }
}
/* export class CourseTypeFilterComponent implements ControlValueAccessor, OnInit {
  private service = inject(CourseService);
  @Output() valueChange = new EventEmitter<number | null>();
  @Input() mode: IFieldMode = 'FILTERING'; //type IFieldMode = "EDITING" | "CREATING" | "FILTERING"
  store = inject(Store<AppState>);
  roleCode: string = '';

  control = new FormControl<ICourseType | string | null>(null);

  items: ICourseType[] = [];
  filteredItems: ICourseType[] = [];

  private value: number | null = null;
  private onChange: (value: number | null) => void = () => { };
  onTouched: () => void = () => { };

  ngOnInit(): void {
    this.store.select(selectUserRole).subscribe((role) => {

      if (role && role.code)
        this.roleCode = role.code;
    })

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
    const selected = event.option.value as ICourseType;
    this.value = selected.id;
    this.valueChange.emit(selected.id);
    this.onChange(this.value);
    this.onTouched();
  }

  displayName = (entity: ICourseType | string | null): string =>
    typeof entity === 'object' && entity ? entity.description : '';

  private getItems(): void {
    this.service.getTypes().subscribe(data => {
      this.items = data;
      this.filteredItems = data;

      this.applyCurrentValue();
    });
  }

  private filter(value: ICourseType | string | null): ICourseType[] {
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

    if (this.mode !== 'FILTERING') {
      const type = this.items.find(s => s.code === getDefaultCourseType(this.roleCode));
      if (!type) return;
      this.control.setValue(type, { emitEvent: false });
      this.onChange(type.id);

      if (this.roleCode && this.roleCode !== 'SUPER')
        this.control.disable({ emitEvent: false });
    }
  }

} */



/* export class AppCourseTypeFilterComponent implements OnInit {
  store = inject(Store<AppState>);
  roleCode: string = '';
  private service = inject(CourseService);

  protected items = signal<ICourseType[]>([]);
  protected filteredItems = signal<ICourseType[]>([]);
  selectedItem = model<ICourseType | null>(null);

  @Output() selected: EventEmitter<ICourseType> = new EventEmitter<ICourseType>();
  editable = input<boolean>(true);
  filtering = input<boolean>(true);
  required = input<boolean>(false);


  protected control = new FormControl<ICourseType | string>('');

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
      
      if(this.roleCode && this.roleCode !== 'SUPER' && !this.filtering())
        this.control.disable({ emitEvent: false });


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
    this.store.select(selectUserRole).subscribe((role) => {

      if(role && role.code)
        this.roleCode = role.code;
    })
    this.getItems();
    if(this.required())
      this.control.setValidators((control) => control.value ? null : { required: true });
  }

  getItems(): void {
    this.service.getTypes().subscribe({
      next: (data) => {
        this.items.set(data);
        if(this.filtering()) 
          this.items().unshift(this.all)
        else 
          this.selectedItem.set(data.find(s => s.code === getDefaultCourseType(this.roleCode)) || null);
        this.filteredItems.set(this.items());
      },
      //error: (err) => console.error('Error fetching categories:', err),
    });
  }

  private _getFilterValue(value: ICourseType | string | null): string {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value && value.description) {
      return value.description.toLocaleLowerCase();
    }
    return '';
  }

  private _filter(value: ICourseType | string | null): ICourseType[] {
    const filterValue = this._getFilterValue(value);
    return this.items().filter((item) => item.description?.toLowerCase().includes(filterValue));
  }


  displayName = (entity: ICourseType | string | null): string => {
      return (entity && typeof entity !== 'string' && entity.description) ? entity.description : (entity as string || '');
  };
  
  onSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as ICourseType;
    this.selectedItem.set(selected);
    this.selected.emit(selected);
  }

  all: ICourseType = {
    id: 0,
    code: 'ALL',
    description: 'Todas',
  }
} */
