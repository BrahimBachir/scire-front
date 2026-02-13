import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, model, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { TernaryFilterConfig, TernaryItem } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'ternary-filter',
  templateUrl: './ternary.component.html',
  imports: [
    CommonModule,
    IconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
  ],
providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppTernaryFilterComponent),
      multi: true,
    },
  ],
})
export class AppTernaryFilterComponent implements ControlValueAccessor {
  @Input({ required: true }) config: TernaryFilterConfig | null | undefined;

  // Internal control to track the boolean | null state
  control = new FormControl<boolean | null>(null);

  onChange: (value: boolean | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    // Sync internal changes to the parent form
    this.control.valueChanges.subscribe((val) => {
      this.onChange(val);
    });
  }

  // CVA Implementation
  writeValue(value: boolean | null): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  clean(): void {
    this.control.setValue(null);
    this.onTouched();
  }
}
