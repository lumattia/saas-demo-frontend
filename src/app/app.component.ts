import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

import { LoginPageComponent } from './features/auth/pages/login/login-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPageComponent, CommonModule],
  template: `
    @if (auth.isAuthenticated()) {
      <router-outlet />
    } @else if (loading()) {
      <div class="loading">Cargando...</div>
    } @else {
      <app-login-page />
    }
  `,
  styles: [`
    .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.5rem; }
  `]
})
export class AppComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly loading = signal(true);

  ngOnInit() {
    this.auth.init().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false)
    });
  }
}
