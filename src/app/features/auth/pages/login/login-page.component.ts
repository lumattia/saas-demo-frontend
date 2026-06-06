import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <button class="theme-toggle" (click)="theme.toggle()" [title]="'Switch to ' + (theme.mode() === 'light' ? 'dark' : 'light') + ' mode'">
        {{ theme.mode() === 'light' ? '🌙' : '☀️' }}
      </button>
      <div class="login-card">
        <h1>Warehouse Demo</h1>
        <p>Bienvenido a la demo del sistema de gestión de almacén.</p>
        <div class="actions">
          <button (click)="auth.login()" class="btn btn-primary">
            Iniciar Sesión con Auth0
          </button>
          
          <div class="divider">
            <span>O</span>
          </div>
          
          <button (click)="createDemo()" class="btn btn-secondary" [disabled]="loading">
            {{ loading ? 'Creando...' : 'Crear Mi Demo (24 horas)' }}
          </button>
        </div>
        
        <p class="footer-text">
          Al crear una demo, se generará una cuenta real temporal en Auth0 y un entorno privado para ti.
        </p>
          <p>Contraseña de la Demo: {{ password }}</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--bg-alt);
      position: relative;
    }
    .theme-toggle {
      position: absolute;
      top: var(--spacing-lg);
      right: var(--spacing-lg);
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--spacing-sm);
      cursor: pointer;
      font-size: 1.5rem;
      transition: all 0.2s ease;
      z-index: 10;
    }
    .theme-toggle:hover {
      background-color: var(--bg-secondary);
    }
    .login-card {
      background: var(--bg);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      max-width: 400px;
      width: 100%;
      text-align: center;
      border: 1px solid var(--border);
    }
    h1 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--text); margin-bottom: var(--spacing-sm); }
    p { color: var(--text-secondary); margin-bottom: var(--spacing-2xl); }
    .actions { display: flex; flex-direction: column; gap: var(--spacing-md); }
    .btn {
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      width: 100%;
    }
    .btn-primary { background-color: var(--primary); color: white; }
    .btn-primary:hover { opacity: 0.8; }
    .btn-secondary { background-color: var(--success); color: white; }
    .btn-secondary:hover { opacity: 0.8; }
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--text-secondary);
      margin: var(--spacing-sm) 0;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--border);
    }
    .divider span { padding: 0 var(--spacing-md); font-size: var(--font-size-sm); }
    .footer-text { font-size: var(--font-size-xs); margin-top: var(--spacing-2xl); margin-bottom: 0; }
  `]
})
export class LoginPageComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private router = inject(Router);
  loading = false;
  password='';

  ngOnInit(){
    if(this.auth.isAuthenticated()){
      const availableModules = this.auth.modules();
      if (availableModules.length > 0) {
        const firstModule = availableModules[0];
        const moduleRouteMap: { [key: string]: string } = {
          'DRESS': '/dresses',
          'DRESS_MOVEMENT': '/dress-movements',
          'TENANT': '/tenants',
          'USER': '/users'
        };
        const route = moduleRouteMap[firstModule] || '/dresses';
        this.router.navigate([route]);
      } else {
        this.router.navigate(['/dresses']);
      }
    }
  }
  createDemo() {
    this.loading = true;
    this.auth.createDemoAccount().subscribe({
      next: (res) => {
        this.loading = false,
        this.password=res.password;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error creating demo:', err);
        alert('There was an error connecting to the server. Please make sure the backend is running at http://localhost:8080');
      }
    });
  }
}
