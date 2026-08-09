import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function initialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // 1. Initialize the signal from localStorage, falling back to system preference
  private themeSignal = signal<Theme>(initialTheme());

  // 2. Expose the signal as read-only
  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    // 3. Persist to localStorage whenever the theme changes. DOM updates (e.g.
    // IllustrationComponent re-rendering the themed asset) are each consumer's own
    // responsibility, driven by reading the `theme` signal.
    effect(() => {
      localStorage.setItem(STORAGE_KEY, this.themeSignal());
    });
  }

  setTheme(theme: Theme) {
    this.themeSignal.set(theme);
  }
}
