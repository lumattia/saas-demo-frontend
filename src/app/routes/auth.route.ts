import { Routes } from '@angular/router';
import { LoginPageComponent } from '../features/auth/pages/login/login-page.component';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  }
];
