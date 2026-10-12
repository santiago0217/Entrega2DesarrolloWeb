import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoginForm } from '../../components/login-form/login-form';
import { Credenciales } from '../../models/usuario.model';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private router = inject(Router);
  private sesionService = inject(SesionService);

  procesarLogin(credenciales: Credenciales): void {
    // La contraseña no se imprime ni se guarda; solo se usa el correo para el saludo.
    this.sesionService.iniciar(credenciales.correo);
    this.router.navigate(['/usuarios']);
  }
}
