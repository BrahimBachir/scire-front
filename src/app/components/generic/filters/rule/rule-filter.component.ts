import { Component, effect, EventEmitter, forwardRef, inject, input, Input, model, OnInit, Output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LegislationService } from 'src/app/services';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { IFieldMode, IRule } from 'src/app/common/models/interfaces';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { getSelectedRule } from 'src/app/common/store/selectors/learning.selectors';
import { setSelectedRule } from 'src/app/common/store/actions';
import { IconModule } from 'src/app/icon/icon.module';
import { BaseFilterDirective } from 'src/app/common/directives';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'rule-filter',
  templateUrl: './rule-filter.component.html',
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
    MatTooltipModule
  ],
})
export class RuleFilterComponent extends BaseFilterDirective<IRule> {
  private service = inject(LegislationService);
  private state = inject(Store<AppState>);

  loadData(): void {
    this.service.getRules().subscribe(data => {
      this.items = data.rows as IRule[];
      this.filteredItems = data.rows as IRule[];
      this.applyCurrentValue();
    });
  }

  private applyCurrentValue(): void {
    if (this.value != null) {
      this.syncInternalControl();
      return;
    }

    this.autoSelectIfSingleOption();

    /* if (this.mode === 'CREATING') {
      this.state.select(getSelectedRule).subscribe(rule => {
        if (rule) {
          this.writeValue(rule.id);
          this.onChange(rule.id);
          this.control.disable({ emitEvent: false });
        }
      });
    } */
  }
}


/*  implements ControlValueAccessor, OnInit {
  private service = inject(LegislationService);
  private state = inject(Store<AppState>);
  @Output() valueChange = new EventEmitter<number | null>();
  @Input() mode: IFieldMode = 'FILTERING'; //type IFieldMode = "EDITING" | "CREATING" | "FILTERING"

  control = new FormControl<IRule | string | null>(null);

  items: IRule[] = [];
  filteredItems: IRule[] = [];

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
    const selected = event.option.value as IRule;
    this.value = selected.id;
    this.state.dispatch(setSelectedRule(selected))
    
    this.valueChange.emit(selected.id);
    this.onChange(this.value);
    this.onTouched();
  }

  displayName = (entity: IRule | string | null): string =>
    typeof entity === 'object' && entity ? entity.description : '';

  private getItems(): void {
    this.service.getRules().subscribe(data => {
      this.items = data.rows as IRule[];
      this.filteredItems = data.rows as IRule[];

      this.applyCurrentValue();
    });
  }

  private filter(value: IRule | string | null): IRule[] {
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

  this.value = null;
  this.onChange(null);
  this.onTouched();

  this.valueChange.emit(null);
  this.state.dispatch(setSelectedRule(null as any));
}


  private applyCurrentValue(): void {
    if (this.value != null) {
      this.writeValue(this.value);
      return;
    }

    if (this.mode === 'CREATING') {
      this.state.select(getSelectedRule).subscribe(rule =>{
        if (rule) {
          this.control.setValue(rule, { emitEvent: false });
          this.onChange(rule.id);
        }
      });
    }
  }
} */

/* export class RuleFilterComponent implements OnInit {

  private legislationService = inject(LegislationService)

  protected items = signal<IRule[]>([]);
  protected filteredItems = signal<IRule[]>([]);
  selectedItem = model<IRule | null>(null);
  @Output() selected: EventEmitter<IRule> = new EventEmitter<IRule>();
  editable = input<boolean>(true);
  filtering = input<boolean>(true);

  protected control = new FormControl<IRule | string>('');

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
  }

  clean(){
    this.selectedItem.set(null);
    this.control.reset(null, { emitEvent: false });
    this.filteredItems.set(this.items());
  }

  ngOnInit(): void {
    this.getItems();

    this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredItems.set(this._filter(value || ''));
    });

  }

  getItems(): void {
    this.legislationService.getRules().subscribe({
      next: (data) => {
        this.items.set(data.rows as IRule[]);
        if(this.filtering())
          this.items().unshift(this.all)
        this.filteredItems.set(this.items());
      },
      //error: (err) => console.error('Error fetching categories:', err),
    });
  }

  private _getFilterValue(value: IRule | string | null): string {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value && value.description) {
      return value.description.toLocaleLowerCase();
    }
    return '';
  }

  private _filter(value: IRule | string | null): IRule[] {
    const filterValue = this._getFilterValue(value);
    return this.items().filter((item) => item.description.toLowerCase().includes(filterValue));
  }


  displayName = (entity: IRule | string | null): string => {
      return (entity && typeof entity !== 'string' && entity.description) ? entity.description : (entity as string || '');
  };
  
  onSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IRule;
    this.selectedItem.set(selected);
    this.selected.emit(selected);
  }

  all: IRule = {
    id: 0,
    code: 'ALL',
    description: 'Todas'
  }
}
 */