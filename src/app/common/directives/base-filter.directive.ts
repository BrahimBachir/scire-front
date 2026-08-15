import { Directive, EventEmitter, Input, OnInit, Output, Self, Optional, inject, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, Validators } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { IFieldMode } from '../models/interfaces';

// Define a basic interface that all your filter items share
export interface IFilterItem {
  id: number;
  description: string;
  code?: string;
  title?: string;
}

@Directive()
export abstract class BaseFilterDirective<T extends IFilterItem> implements ControlValueAccessor, OnInit {
  @Input() mode: IFieldMode;
  @Input() parentId: number | null = null;
  @Output() valueChange = new EventEmitter<number | null>();

  // Inject NgControl to link with the parent form validation
  public ngControl = inject(NgControl, { self: true, optional: true });

  // Internal control for the UI/Autocomplete
  control = new FormControl<T | string | null>(null);

  items: T[] = [];
  filteredItems: T[] = [];
  protected value: number | null = null;

  onChange: (value: number | null) => void = () => { };
  onTouched: () => void = () => { };

  constructor() {
    if (this.ngControl)
      this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.loadData();

    if (this.ngControl?.control) {
      this.control.setValidators(this.ngControl.control.validator);
      this.control.updateValueAndValidity({ emitEvent: false });
    }

    this.control.valueChanges
      .pipe(startWith(''), debounceTime(200))
      .subscribe(value => {
        this.filteredItems = this.filterLogic(value);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
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

  private onParentChange(): void {
    // 1. Clear the current selection since the parent changed
    this.clean();

    // 2. Reload data with the new parent context
    this.loadData();
  }

  // Abstract method: each child must implement how to fetch its specific data
  abstract loadData(): void;

  // Common UI Actions
  onSelected(item: T): void {
    this.value = item.id;
    this.onChange(this.value);
    this.onTouched();
    this.control.markAsDirty();
    this.valueChange.emit(this.value);
  }

  handleBlur(): void {
    this.onTouched();
    this.control.markAsTouched();
  }

  clean(): void {
    this.control.reset(null);
    this.value = null;
    this.onChange(null);
    this.valueChange.emit(null);
  }

  // ControlValueAccessor Implementation
  writeValue(val: number | null): void {
    this.value = val;
    this.syncInternalControl();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  // Helpers
  protected syncInternalControl(): void {
    const selected = this.items.find(i => i.id === this.value) || null;
    this.control.setValue(selected as any, { emitEvent: false });
  }

  private filterLogic(val: T | string | null): T[] {
    const text = typeof val === 'string' ? val.toLowerCase() : val?.description.toLowerCase() || '';
    return this.items.filter(i => i.description.toLowerCase().includes(text));
  }

  displayName = (entity: T | string | null): string => {
    return typeof entity === 'object' && entity ? entity.description : '';
  }
}