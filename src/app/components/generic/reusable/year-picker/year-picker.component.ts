import { Component, model, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  ],
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    ReactiveFormsModule
  ],
})
export class YearPickerComponent implements OnInit {
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
}

/* import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MaterialModule } from 'src/app/material.module';

// Custom date formats for Year selection only
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  standalone: true,
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MaterialModule
],
})
export class YearPickerComponent {
  date = new FormControl();
  year = signal<number>(0);

  chosenYearHandler(normalizedYear: Date, datepicker: MatDatepicker<Date>) {
    // Set the value of the control to the selected year
    this.date.setValue(normalizedYear); 
    this.year.set(normalizedYear.getFullYear())
    
    // Manually close the datepicker so it doesn't move to month selection
    datepicker.close();
  }
} */