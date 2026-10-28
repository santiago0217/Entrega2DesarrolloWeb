import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoginForm } from '../../components/login-form/login-form';
import { Credenciales } from '../../models/usuario.model';
import { mensajeError } from '../../services/mensaje-error';
import { SesionService, rutaInicio } from '../../services/sesion.service';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private router = inject(Router);
  private sesionService = inject(SesionService);

  protected readonly error = signal('');
  protected readonly cargando = signal(false);
  protected readonly registrado = inject(ActivatedRoute).snapshot.queryParamMap.has('registrado');

  // El hijo emite las credenciales; el padre las envía al backend y va a la página de su rol.
  // La contraseña no se imprime ni se guarda.
  procesarLogin(credenciales: Credenciales): void {
    this.cargando.set(true);
    this.error.set('');
    this.sesionService.login(credenciales).subscribe({
      next: (usuario) => this.router.navigateByUrl(rutaInicio(usuario.rol)),
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }
}
