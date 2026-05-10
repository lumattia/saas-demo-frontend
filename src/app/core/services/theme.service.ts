import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<'light' | 'dark'>('light');

  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.mode());
    });
  }

  toggle(): void {
    this.mode.update((value) => (value === 'light' ? 'dark' : 'light'));
  }
}
