import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
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
          
          <button (click)="auth.createDemoAccount().subscribe()" class="btn btn-secondary">
            Crear Mi Demo (24 horas)
          </button>
        </div>
        
        <p class="footer-text">
          Al crear una demo, se generará una cuenta real temporal en Auth0 y un entorno privado para ti.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f3f4f6;
    }
    .login-card {
      background: white;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    h1 { font-size: 1.875rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem; }
    p { color: #4b5563; margin-bottom: 2rem; }
    .actions { display: flex; flex-direction: column; gap: 1rem; }
    .btn {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      width: 100%;
    }
    .btn-primary { background-color: #4f46e5; color: white; }
    .btn-primary:hover { background-color: #4338ca; }
    .btn-secondary { background-color: #10b981; color: white; }
    .btn-secondary:hover { background-color: #059669; }
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: #9ca3af;
      margin: 0.5rem 0;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #e5e7eb;
    }
    .divider span { padding: 0 0.75rem; font-size: 0.875rem; }
    .footer-text { font-size: 0.75rem; margin-top: 2rem; margin-bottom: 0; }
  `]
})
export class LoginPageComponent {
  readonly auth = inject(AuthService);
}
