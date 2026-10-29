import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { UsuarioForm } from '../../components/usuario-form/usuario-form';
import { Rol, Usuario } from '../../models/usuario.model';
import { mensajeError } from '../../services/mensaje-error';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-registro-page',
  imports: [UsuarioForm, RouterLink],
  templateUrl: './registro-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroPage {
  private sesionService = inject(SesionService);
  private router = inject(Router);

  protected readonly roles: readonly Rol[] = ['CLIENTE'];
  protected readonly error = signal('');

  registrar(usuario: Usuario): void {
    this.error.set('');
    this.sesionService.registrar(usuario).subscribe({
      next: () => this.router.navigate(['/login'], { queryParams: { registrado: true } }),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }
}
