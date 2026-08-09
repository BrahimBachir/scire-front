import { Directive, OnInit, OnChanges, Input, Output, EventEmitter, inject, SimpleChanges } from "@angular/core";
import { ControlValueAccessor, NgControl, FormControl } from "@angular/forms";
import { startWith, debounceTime } from "rxjs";
import { IFieldMode } from "../models/interfaces";
import { IFilterItem } from "./base-filter.directive";

@Directive()
export abstract class BaseMultiSelectCva<T extends IFilterItem>
  implements ControlValueAccessor, OnInit, OnChanges {

  @Input() mode: IFieldMode = 'FILTERING';
  @Input() parentId: number | null = null;
  @Output() valueChange = new EventEmitter<number[]>();

  public ngControl = inject(NgControl, { self: true, optional: true });

  /** Input control (search box only) */
  control = new FormControl<string | null>(null);

  items: T[] = [];
  filteredItems: T[] = [];
  selectedItems: T[] = [];

  protected value: number[] = [];

  protected onChange: (value: number[]) => void = () => { };
  protected onTouched: () => void = () => { };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // =========================
  //  Lifecycle
  // =========================

  ngOnInit(): void {
    this.loadData();

    if (this.ngControl?.control) {
      this.control.setValidators(this.ngControl.control.validator);
      this.control.updateValueAndValidity({ emitEvent: false });
    }

    this.control.valueChanges
      .pipe(startWith(''), debounceTime(200))
      .subscribe(value => this.filter(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentId']) {

      if (this.parentId) {
        this.control.enable({ emitEvent: false });
      } else {
        this.control.disable({ emitEvent: false });
      }

      if (!changes['parentId'].firstChange) {
        this.onParentChange();
      }
    }
  }

  protected onParentChange(): void {
    this.clean();
    this.loadData();
  }

  // =========================
  //  Abstract method
  // =========================

  protected abstract loadData(): void;

  // =========================
  //  CVA
  // =========================

  writeValue(ids: number[] | null): void {
    this.value = ids ?? [];
    this.syncSelectedItems();
  }

  registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.control.disable({ emitEvent: false })
      : this.control.enable({ emitEvent: false });
  }

  // =========================
  //  Selection Logic
  // =========================

  toggleSelection(item: T): void {
    const exists = this.value.includes(item.id);
    this.value = exists
      ? this.value.filter(id => id !== item.id)
      : [...this.value, item.id];

    this.emitChanges();
    this.syncSelectedItems();
  }

  remove(item: T): void {
    this.value = this.value.filter(id => id !== item.id);
    this.emitChanges();
    this.syncSelectedItems();
  }

  isSelected(item: T): boolean {
    return this.value.includes(item.id);
  }

  clean(): void {
    this.control.setValue('', { emitEvent: true });
    this.value = [];
    this.selectedItems = [];
    this.filteredItems = [...this.items];

    this.emitChanges();
  }

  protected emitChanges(): void {
    this.onChange(this.value);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  // =========================
  //  Sync Logic
  // =========================

  protected syncSelectedItems(): void {
    if (!this.items.length || !this.value.length) {
      this.selectedItems = [];
      return;
    }

    const map = new Map<number, T>(
      this.items.map(i => [i.id, i])
    );

    this.selectedItems = this.value
      .map(id => map.get(id))
      .filter((i): i is T => !!i);
  }

  // =========================
  //  Filtering
  // =========================

  protected filter(searchValue: string | null): void {
    const text = (searchValue ?? '').toLowerCase();

    this.filteredItems = this.items.filter(item =>
      this.displayLabel(item).toLowerCase().includes(text)
    );
  }

  protected displayLabel(item: T): string {
    return item.title ?? item.description ?? '';
  }
}
