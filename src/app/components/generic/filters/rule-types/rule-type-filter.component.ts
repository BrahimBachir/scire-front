import { Component, effect, EventEmitter, forwardRef, inject, Input, input, model, OnInit, Output, signal } from '@angular/core';
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
import { IRule, IRuleType, IRuleAmbit, IRuleGazette, IFieldMode } from 'src/app/common/models/interfaces';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'rule-type-filter',
  templateUrl: './rule-type-filter.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RuleTypeFilterComponent),
    multi: true,
  }],
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
    MatTooltipModule,
  ],
})
export class RuleTypeFilterComponent  implements ControlValueAccessor, OnInit {
  private service = inject(LegislationService);
  @Output() valueChange = new EventEmitter<number | null>();
  @Input() mode: IFieldMode = 'FILTERING'; //type IFieldMode = "EDITING" | "CREATING" | "FILTERING"

  control = new FormControl<IRuleType | string | null>(null);

  items: IRuleType[] = [];
  filteredItems: IRuleType[] = [];

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
    const selected = event.option.value as IRuleType;
    this.value = selected.id;
    this.valueChange.emit(selected.id);
    this.onChange(this.value);
    this.onTouched();
  }

  displayName = (entity: IRuleType | string | null): string =>
    typeof entity === 'object' && entity ? entity.description : '';

  private getItems(): void {
    this.service.getRuleTypes().subscribe(data => {
      this.items = data;
      this.filteredItems = data;

      this.applyCurrentValue();
    });
  }

  private filter(value: IRuleType | string | null): IRuleType[] {
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
/* export class RuleTypeFilterComponent implements OnInit {

  private legislationService = inject(LegislationService)

  protected items = signal<IRuleType[]>([]);
  protected filteredItems = signal<IRuleType[]>([]);
  selectedItem = model<IRuleType | null>(null);
  @Output() selected: EventEmitter<IRuleType> = new EventEmitter<IRuleType>();
  editable = input<boolean>(true);
  filtering = input<boolean>(true);
  
  protected control = new FormControl<IRuleType | string>('');

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
    this.legislationService.getRuleTypes().subscribe({
      next: (data) => {
        if(this.filtering())
          data.unshift(this.all)
        this.items.set(data);
        this.filteredItems.set(data);
      },
      //error: (err) => console.error('Error fetching categories:', err),
    });
  }

  private _getFilterValue(value: IRuleType | string | null): string {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value && value.description) {
      return value.description.toLocaleLowerCase();
    }
    return '';
  }

  private _filter(value: IRuleType | string | null): IRuleType[] {
    const filterValue = this._getFilterValue(value);
    return this.items().filter((item) => item.description.toLowerCase().includes(filterValue));
  }


  displayName = (entity: IRuleType | string | null): string => {
      return (entity && typeof entity !== 'string' && entity.description) ? entity.description : (entity as string || '');
  };
  
  onSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IRuleType;
    this.selectedItem.set(selected);
    this.selected.emit(selected);

  }

  all: IRuleType = {
    id: 0,
    code: 'ALL',
    description: 'Todos'
  }
}
 */