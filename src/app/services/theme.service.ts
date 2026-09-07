import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'mahesh_theme';

  readonly theme = signal<Theme>('light');
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    if (typeof window === 'undefined') return;

    try {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(prefersDark ? 'dark' : 'light');
      }
    } catch (e) {
      this.setTheme('light');
    }
  }

  toggleTheme() {
    const nextTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(newTheme: Theme) {
    this.theme.set(newTheme);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', newTheme);
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      try {
        localStorage.setItem(this.STORAGE_KEY, newTheme);
      } catch (e) {}
    }
  }
}
