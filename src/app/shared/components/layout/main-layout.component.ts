import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { SelectInputComponent } from '../inputs/select-input/select-input.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, SelectInputComponent],
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
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'zh', name: '中文', flag: '🇨🇳' },
    { id: 'it', name: 'Italiano', flag: '🇮🇹' },
  ];

  ngOnInit() {
    const savedLang = localStorage.getItem('user_language') || this.translate.currentLang || 'es';
    
    this.translate.use(savedLang);
    this.currentLang.set(savedLang);
  }
  
  toggleSidenav(): void {
    this.sidenavCollapsed.update(collapsed => !collapsed);
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang).subscribe(() => {
      this.currentLang.set(lang);
      localStorage.setItem('user_language', lang);
    });
  }

  switchTenant(tenantId: string): void {
    this.auth.switchTenant(tenantId).subscribe();
  }
}
