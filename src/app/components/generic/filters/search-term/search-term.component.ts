import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Component, effect, forwardRef, model, OnDestroy, OnInit, signal } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'search-term-filter',
  templateUrl: './search-term.component.html',
  imports: [
    CommonModule,
    IconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSearchTermFilterComponent),
      multi: true,
    },
  ],
})
export class AppSearchTermFilterComponent implements ControlValueAccessor, OnInit, OnDestroy {
  // Internal control to handle typing and debouncing
  control = new FormControl<string | null>(null);
  
  private sub = new Subscription();

  // CVA Callbacks
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    this.sub = this.control.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((val) => {
        // Logic: Emit to parent only if empty (to reset) or if >= 3 characters
        if (!val || val.length >= 3) {
          this.onChange(val);
        }
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // ControlValueAccessor Implementation
  writeValue(value: string | null): void {
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
    this.control.setValue(null); // This triggers the valueChanges logic and emits null
    this.onTouched();
  }
}
/* export class AppSearchTermFilterComponent {
  readonly search = model<string | null>(null);
  readonly raw = signal<string | null>(null);
  private timer: any;

  constructor() {
    effect(() => {
      const v = this.raw();
      clearTimeout(this.timer);

      if (!v || v.length < 3) return;

      this.timer = setTimeout(() => {
        this.search.set(v);
      }, 500);
    });
  }

  onInput(value: string) {
    this.raw.set(value);
  }

  clean() {
    this.raw.set(null);
    this.search.set(null);
  }
} */
