import { Injectable, signal, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'en' | 'es' | 'fr' | 'ca';

const SUPPORTED_LANGS: Lang[] = ['en', 'es', 'fr', 'ca'];
const STORAGE_KEY = 'lang';

function initialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored as Lang)) return stored as Lang;

  const browserLang = navigator.language?.slice(0, 2);
  if (browserLang && SUPPORTED_LANGS.includes(browserLang as Lang)) return browserLang as Lang;

  return 'es';
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private langSignal = signal<Lang>(initialLang());

  readonly lang = this.langSignal.asReadonly();

  constructor(private translate: TranslateService) {
    effect(() => {
      const lang = this.langSignal();
      localStorage.setItem(STORAGE_KEY, lang);
      this.translate.use(lang);
    });
  }

  setLang(lang: Lang) {
    this.langSignal.set(lang);
  }
}
