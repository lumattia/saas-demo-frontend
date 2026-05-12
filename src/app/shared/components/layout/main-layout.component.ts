import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  template: `
    <div [class.dark]="theme.mode() === 'dark'" class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <span class="text-xl font-bold text-indigo-600 dark:text-indigo-400">Warehouse</span>
              </div>
              <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                @if (auth.hasModule('DRESS')) {
                  <a routerLink="/dresses" routerLinkActive="border-indigo-500 text-gray-900 dark:text-white"
                     class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Vestidos
                  </a>
                }
                @if (auth.hasModule('INVENTORY')) {
                  <a routerLink="/inventory" routerLinkActive="border-indigo-500 text-gray-900 dark:text-white"
                     class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Inventario
                  </a>
                }
                @if (auth.isAtLeastAdmin()) {
                  <a routerLink="/admin/tenants" routerLinkActive="border-indigo-500 text-gray-900 dark:text-white"
                     class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Tenants
                  </a>
                }
              </div>
            </div>
            <div class="flex items-center">
              <button (click)="theme.toggle()" class="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                @if (theme.mode() === 'light') {
                  <span class="material-icons">dark_mode</span>
                } @else {
                  <span class="material-icons">light_mode</span>
                }
              </button>
              <div class="ml-4 flex items-center">
                @if (auth.user()?.auth0Sub) {
                  <button (click)="auth.logout()" class="mr-4 text-sm text-red-600 hover:text-red-800">Logout</button>
                } @else {
                  <button (click)="auth.createDemoAccount().subscribe()" class="mr-4 text-sm text-green-600 hover:text-green-800">Crear Mi Demo (24h)</button>
                  <button (click)="auth.login()" class="mr-4 text-sm text-indigo-600 hover:text-indigo-800">Login Auth0</button>
                }
                <span class="text-sm font-medium">{{ auth.user()?.username }}</span>
                <span class="ml-2 text-xs text-gray-400">({{ auth.user()?.tenant?.name }})</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class MainLayoutComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
}
