import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/tenant.model';
import { environment } from '../../../environments/environment';
import { tap, switchMap, of, from } from 'rxjs';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private auth0 = inject(Auth0Service);
  private userSignal = signal<User | null>(null);

  user = this.userSignal.asReadonly();
  isAuthenticated = computed(() => !!this.userSignal());
  
  modules = computed(() => {
    const user = this.userSignal();
    if (!user || !user.tenant || !user.tenant.modules) return [];
    return user.tenant.modules;
  });

  hasModule(moduleName: string): boolean {
    return this.modules().some(m => m === moduleName.toUpperCase());
  }

  isSuperAdmin = computed(() => this.userSignal()?.role === 'SUPERADMIN');
  isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');
  isAtLeastAdmin = computed(() => this.isSuperAdmin() || this.isAdmin());

  init() {
    return this.auth0.isAuthenticated$.pipe(
      switchMap(isAuth => {
        if (isAuth) {
          return this.auth0.getAccessTokenSilently().pipe(
            switchMap(token => {
              const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
              return this.http.get<User>(`${environment.apiUrl}/users/me`, { headers });
            })
          );
        } else {
          // Si no está autenticado con Auth0, no hay sesión (el admin lo manejaremos por login normal si fuera necesario, 
          // pero aquí mantenemos la coherencia con Auth0)
          return of(null);
        }
      }),
      tap(user => this.userSignal.set(user))
    );
  }

  createDemoAccount() {
    return this.http.post<any>(`${environment.apiUrl}/users/demo`, {}).pipe(
      tap(res => {
        alert(`¡Cuenta de Demo creada en Auth0!\n\nEmail: ${res.email}\nPassword: ${res.password}\n\nUsa estas credenciales en la pantalla de login que aparecerá a continuación.`);
        this.login();
      })
    );
  }

  login() {
    localStorage.removeItem('demo_user');
    this.auth0.loginWithRedirect();
  }

  logout() {
    localStorage.removeItem('demo_user');
    this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
