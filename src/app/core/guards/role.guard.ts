import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  const requiredRole = route.data['requiredRole'] as string;
  
  if (!requiredRole) {
    return true; // If no role specified, allow access
  }

  const userRole = auth.user()?.role;
  
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // Check if user has the required role or higher
  const roleHierarchy: Record<string, number> = {
    'USER': 1,
    'ADMIN': 2,
    'RESELLER': 3,
    'SUPERADMIN': 4
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  if (userLevel >= requiredLevel) {
    return true;
  }

  // If user doesn't have the required role, redirect to home
  router.navigate(['/']);
  return false;
};
