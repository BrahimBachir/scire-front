import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // 1. Create a signal with the initial value from localStorage or system preference
  private themeSignal = signal<Theme | null>(null);

  // 2. Expose the signal as read-only
  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    // TODO: wire this up to actually update the DOM and persist to localStorage
    // when the signal changes - not implemented yet.
    effect(() => {
      const current = this.themeSignal();
    });
  }

  setTheme(theme: Theme) {
    this.themeSignal.set(theme);
  }
}
