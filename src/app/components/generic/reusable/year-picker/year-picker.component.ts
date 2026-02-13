import { Component, forwardRef, model, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

// Custom format for Native Date
export const MY_NATIVE_FORMATS = {
  parse: {
    dateInput: { year: 'numeric' },
  },
  display: {
    dateInput: { year: 'numeric' },
    monthYearLabel: { year: 'numeric' },
    dateA11yLabel: { year: 'numeric' },
    monthYearA11yLabel: { year: 'numeric' },
  },
};

@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_NATIVE_FORMATS },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YearPickerComponent),
      multi: true,
    },
  ],
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    ReactiveFormsModule
  ],
})
export class YearPickerComponent implements ControlValueAccessor {

  /** Internal UI control */
  date = new FormControl<Date | null>(null);

  minDate = new Date(1900, 0, 1);

  /** CVA value */
  private value: number | null = null;

  /** CVA callbacks */
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(year: number | null): void {
    this.value = year;

    if (year) {
      this.date.setValue(new Date(year, 0, 1), { emitEvent: false });
    } else {
      this.date.setValue(null, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.date.disable() : this.date.enable();
  }

  /** UI interaction */
  chosenYearHandler(normalizedYear: Date, datepicker: MatDatepicker<Date>) {
    const year = normalizedYear.getFullYear();

    this.value = year;
    this.onChange(year);
    this.onTouched();

    this.date.setValue(new Date(year, 0, 1), { emitEvent: false });
    datepicker.close();
  }
}


/* export class YearPickerComponent implements OnInit {
  date = new FormControl(new Date());
  year = model<number>(0);
  minDate = new Date();

  constructor(){
  }
  ngOnInit(): void {
    const year = new Date().getFullYear()
    this.year.set(year);
  }

  chosenYearHandler(normalizedYear: Date, datepicker: MatDatepicker<Date>) {
    this.date.setValue(normalizedYear);
    this.year.set(normalizedYear.getFullYear())
    datepicker.close();
  }
} */