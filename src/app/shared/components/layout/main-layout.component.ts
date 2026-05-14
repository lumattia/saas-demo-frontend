import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly translate = inject(TranslateService);

  sidenavCollapsed = signal(false);
  pageTitle = signal('nav.home');
  currentLang = signal('es');

  availableLanguages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ];

  ngOnInit() {
    this.currentLang.set(this.translate.currentLang || 'es');
  }

  toggleSidenav(): void {
    this.sidenavCollapsed.update(collapsed => !collapsed);
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang).subscribe(() => {
      this.currentLang.set(lang);
    });
  }
}
