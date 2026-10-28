import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { API_URL } from '../services/api';
import { SesionService } from '../services/sesion.service';

// Envía la cookie de sesión en cada petición al backend y, si la sesión expiró (401),
// limpia el usuario y vuelve al login.
export const credencialesInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }
  const sesion = inject(SesionService);
  const router = inject(Router);

  return next(req.clone({ withCredentials: true })).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.startsWith(`${API_URL}/auth/`)) {
        sesion.limpiar();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
