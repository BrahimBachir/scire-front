import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Component, effect, model, signal } from '@angular/core';

@Component({
  selector: 'search-term-filter',
  templateUrl: './search-term.component.html',
  imports: [
    CommonModule,
    TablerIconsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class AppSearchTermFilterComponent {
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
}
