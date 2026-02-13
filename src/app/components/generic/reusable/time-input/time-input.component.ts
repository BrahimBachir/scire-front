import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'time-mm-ss',
  templateUrl: './time-input.component.html',
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true
    }
  ]
})
export class TimeInputComponent implements ControlValueAccessor {
  displayValue: string = '';
  isDisabled: boolean = false;

  // Function pointers for CVA
  onChange = (val: number) => {};
  onTouched = () => {};

  // 1. Model -> View (Integer to "MM:SS")
  writeValue(value: number): void {
    if (value !== undefined && value !== null) {
      const mins = Math.floor(value / 60).toString().padStart(2, '0');
      const secs = (value % 60).toString().padStart(2, '0');
      this.displayValue = `${mins}:${secs}`;
    } else {
      this.displayValue = '';
    }
  }

  // 2. View -> Model ("MM:SS" to Integer)
  onInputChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.displayValue = this.applyMask(input);
    
    const parts = this.displayValue.split(':');
    if (parts.length === 2) {
      const totalSeconds = (parseInt(parts[0], 10) * 60) + parseInt(parts[1], 10);
      this.onChange(totalSeconds);
    }
  }

  private applyMask(val: string): string {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 2) {
      clean = clean.substring(0, 2) + ':' + clean.substring(2, 4);
    }
    return clean.substring(0, 5);
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled = isDisabled; }
}