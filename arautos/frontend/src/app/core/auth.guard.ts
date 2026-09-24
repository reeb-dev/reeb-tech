import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Requiere sesión iniciada. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/panel/login']);
};

/** Solo PLATFORM_ADMIN. */
export const platformAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/panel/login']);
  }
  if (auth.isPlatformAdmin()) {
    return true;
  }
  return router.createUrlTree([auth.homePath()]);
};

/** Panel del local: TENANT_* ; PLATFORM_ADMIN va a /panel/admin. */
export const tenantPanelGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/panel/login']);
  }
  if (auth.isPlatformAdmin()) {
    return router.createUrlTree(['/panel/admin']);
  }
  if (auth.isTenantUser()) {
    return true;
  }
  return router.createUrlTree(['/panel/login']);
};
