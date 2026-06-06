import { Injectable, effect, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

interface ThemeConfig {
  version: string;
  name: string;
  description: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  readonly mode = signal<'light' | 'dark'>('light');
  private currentThemeConfig: ThemeConfig | null = null;
  private readonly THEME_STORAGE_KEY = 'theme-mode';

  constructor() {
    this.loadThemePreference();
    this.loadTheme();
    effect(() => {
      const currentMode = this.mode();
      document.documentElement.setAttribute('data-theme', currentMode);
      localStorage.setItem(this.THEME_STORAGE_KEY, currentMode);
      if (this.currentThemeConfig) {
        this.applyTheme(this.currentThemeConfig);
      }
    });
  }

  toggle(): void {
    this.mode.update((value) => (value === 'light' ? 'dark' : 'light'));
  }

  private loadThemePreference(): void {
    const savedMode = localStorage.getItem(this.THEME_STORAGE_KEY);
    if (savedMode === 'light' || savedMode === 'dark') {
      this.mode.set(savedMode);
    }
  }

  private loadTheme(): void {
    this.http.get<ThemeConfig>('assets/theme-config.json').subscribe({
      next: (config) => {
        this.currentThemeConfig = config;
        this.applyTheme(config);
      },
      error: (err) => {
        console.error('Failed to load theme config:', err);
      }
    });
  }

  private applyTheme(config: ThemeConfig): void {
    const root = document.documentElement;
    const currentMode = this.mode();

    for (const key in config) {
      if (key === 'version' || key === 'name' || key === 'description') continue;
      
      const value = config[key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (value.light !== undefined && value.dark !== undefined) {
          const themeValue = value[currentMode];
          const cssVarName = `--${key}`;
          
          if (key.startsWith('image-')) {
            const filter = this.hexToFilter(themeValue);
            root.style.setProperty(cssVarName, filter);
          } else {
            root.style.setProperty(cssVarName, themeValue);
          }
        }
      } else if (typeof value === 'string') {
        const cssVarName = `--${key}`;
        root.style.setProperty(cssVarName, value);
      }
    }
  }

  private hexToFilter(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    const h = delta === 0 ? 0 : 
              max === r ? (60 * ((g - b) / delta) + 360) % 360 :
              max === g ? (60 * ((b - r) / delta) + 120) :
              (60 * ((r - g) / delta) + 240);

    const s = max === 0 ? 0 : (delta / max) * 100;
    const l = max * 100;

    const sepia = Math.min(100, (1 - (r * 0.299 + g * 0.587 + b * 0.114)) * 100);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const contrast = (brightness + 25) / (brightness + 5);

    return `sepia(${sepia}%) hue-rotate(${h}deg) saturate(${s}%) brightness(${brightness}%) contrast(${contrast}%)`;
  }
}
