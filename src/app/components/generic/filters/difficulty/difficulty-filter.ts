import { CommonModule } from "@angular/common";
import { Component, effect, EventEmitter, forwardRef, inject, Input, input, model, OnInit, Output, signal } from "@angular/core";
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { TablerIconsModule } from "angular-tabler-icons";
import { IDifficulty, IFieldMode } from "src/app/common/models/interfaces";
import { MaterialModule } from "src/app/material.module";
import { debounceTime, startWith } from "rxjs";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TestService } from "src/app/services";
import { DifficultyService } from "src/app/services/difficulty.service";

@Component({
  selector: 'difficulty-filter',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AppDifficultyFilterComponent),
    multi: true,
  }],
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: 'difficulty-filter.html',
  standalone: true,
})
export class AppDifficultyFilterComponent implements ControlValueAccessor, OnInit {
    private service = inject(DifficultyService)
  @Output() valueChange = new EventEmitter<number | null>();
  @Input() mode: IFieldMode = 'FILTERING'; //type IFieldMode = "EDITING" | "CREATING" | "FILTERING"

  control = new FormControl<IDifficulty | string | null>(null);

  items: IDifficulty[] = [];
  filteredItems: IDifficulty[] = [];

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
    const selected = event.option.value as IDifficulty;
    this.value = selected.id;
    this.valueChange.emit(selected.id);
    this.onChange(this.value);
    this.onTouched();
  }

  displayName = (entity: IDifficulty | string | null): string =>
    typeof entity === 'object' && entity ? entity.description : '';

  private getItems(): void {
    this.service.getDifficulties().subscribe(data => {
      this.items = data;
      this.filteredItems = data;

      this.applyCurrentValue();
    });
  }

  private filter(value: IDifficulty | string | null): IDifficulty[] {
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
  }

}
/* export class AppDifficultyFilterComponent implements OnInit {
    private service = inject(TestService)

  protected items = signal<IDifficulty[]>([]);
  protected filteredItems = signal<IDifficulty[]>([]);
  selectedItem = model<IDifficulty | null>(null);

  @Output() selected: EventEmitter<IDifficulty> = new EventEmitter<IDifficulty>();
  editable = input<boolean>(true);
  filtering = input<boolean>(true)
  dificultyMaxValue = input<number | null>(null)

  protected control = new FormControl<IDifficulty | string>('');

  form!: FormGroup;

  constructor() {
    effect(() => {
      const items = this.items()

      if(!items) return;

      const maxValue = this.dificultyMaxValue()

      const value = items.filter(i => i.maxValue === maxValue)[0];

      this.selectedItem.set(value)
    })

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

  private _filter(value: IDifficulty | string | null): IDifficulty[] {
    const filterValue = this._getFilterValue(value);
    return this.items().filter((item) => item.name.toLowerCase().includes(filterValue));
  }
  


  getItems(): void {
    this.service.getDifficulties().subscribe({
      next: (data) => {
        this.items.set(data);
        this.filteredItems.set(data);
      },
      //error: (err) => console.error('Error fetching difficulties:', err),
    });
  }

  private _getFilterValue(value: IDifficulty | string | null): string {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value && value.name) {
      return value.name.toLowerCase();
    }
    return '';
  }

  displayEntityName = (entity: IDifficulty| string | null): string => {
    return (entity && typeof entity !== 'string' && entity.name) ? entity.name : (entity as string || '');
  };


  onSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IDifficulty;
    this.selectedItem.set(selected);
  }
}
 */