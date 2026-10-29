import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { Rol } from '../models/usuario.model';
import { SesionService, rutaInicio } from '../services/sesion.service';

export function rolGuard(rol: Rol): CanActivateFn {
  return () => {
    const sesion = inject(SesionService);
    const router = inject(Router);
    return sesion.restaurar().pipe(
      map((usuario) => {
        if (!usuario) {
          return router.createUrlTree(['/login']);
        }
        return usuario.rol === rol ? true : router.createUrlTree([rutaInicio(usuario.rol)]);
      }),
    );
  };
}
