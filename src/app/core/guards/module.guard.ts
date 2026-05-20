import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const moduleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Try to get module name from current route, if not found, try parent route
  let moduleName = route.data['module'] as string;
  if (!moduleName && route.parent) {
    moduleName = route.parent.data['module'] as string;
  }

  if (!moduleName) {
    return true; // If no module specified, allow access
  }

  if (auth.hasModule(moduleName)) {
    return true;
  }

  // If user doesn't have the module, redirect to login
  router.navigate(['/login']);
  return false;
};
