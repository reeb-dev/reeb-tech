import { Injectable, computed, signal } from '@angular/core';
import { Lang, translations } from '../i18n/content';

const STORAGE_KEY = 'reeb-lang';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  lang = signal<Lang>(this.getInitialLang());
  t = computed(() => translations[this.lang()]);

  constructor() {
    this.applyLang(this.lang());
  }

  setLang(lang: Lang): void {
    if (lang === this.lang()) {
      return;
    }
    this.lang.set(lang);
    this.applyLang(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  private getInitialLang(): Lang {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'es';
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es') {
      return saved;
    }
    return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  private applyLang(lang: Lang): void {
    if (typeof document === 'undefined') {
      return;
    }
    const copy = translations[lang];
    document.documentElement.lang = lang;
    document.title = copy.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', copy.meta.description);
    }
  }
}
