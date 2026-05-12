import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const moduleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const moduleName = route.data['module'] as string;
  if (auth.hasModule(moduleName)) {
    return true;
  }

  // Si no tiene el módulo, redirigir a la primera página disponible o al inicio
  const availableModules = auth.modules();
  if (availableModules.length > 0) {
    const firstModule = availableModules[0];
    router.navigate([`/${firstModule}es`]); // Simple mapping, might need improvement
    return false;
  }

  return false;
};
