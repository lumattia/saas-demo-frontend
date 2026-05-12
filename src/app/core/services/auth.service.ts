import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/tenant.model';
import { environment } from '../../../environments/environment';
import { tap, switchMap, of } from 'rxjs';
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
    this.userSignal.set(JSON.parse(localStorage.getItem('user') || 'null'));
    return this.auth0.isAuthenticated$.pipe(
      switchMap(isAuth => {
        if (isAuth) {
          return this.auth0.getAccessTokenSilently().pipe(
            switchMap(token => {
              localStorage.setItem('access_token', token);
              const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
              return this.http.get<User>(`${environment.apiUrl}/users/me`, { headers });
            })
          );
        } else {
          return of(null);
        }
      }),
      tap(user => {
        let localUser = localStorage.getItem('user');
        if (localUser != JSON.stringify(user))
        {
          this.userSignal.set(user);
          localStorage.setItem('user', JSON.stringify(user));
          window.location.reload();
        }
      })
    );
  }
  createDemoAccount() {
    return this.http.post<any>(`${environment.apiUrl}/users/demo`, {}).pipe(
      tap(res => {
        this.auth0.loginWithPopup({
          authorizationParams: {
            login_hint: res.email,
          }
        }).subscribe(() => {
          this.init();
        });
        return res;
      })
    );
  }

  login() {
    this.deleteLocalStorage();
    this.auth0.loginWithRedirect();
  }

  logout() {
    this.deleteLocalStorage();
    this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  }
  deleteLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}
