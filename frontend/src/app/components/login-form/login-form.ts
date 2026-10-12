import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Credenciales } from '../../models/usuario.model';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  titulo = input<string>('Iniciar sesión');
  loginEnviado = output<Credenciales>();

  protected readonly correo = signal('');
  protected readonly password = signal('');

  enviarLogin(): void {
    this.loginEnviado.emit({ correo: this.correo(), password: this.password() });
    this.password.set('');
  }
}
