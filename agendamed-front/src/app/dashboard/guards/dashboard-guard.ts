import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const dashboardGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('access_token') || '';
  const isValid = await authService.verifyToken(token);

  if (isValid) {
    return true;
  }

  localStorage.removeItem('access_token');
  router.navigate(['']);
  return false;
};