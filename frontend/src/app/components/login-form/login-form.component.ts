import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Credenciales } from '../../models/usuario.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
      <h2>{{ titulo() }}</h2>
      <form (ngSubmit)="enviarLogin()">
        <div style="margin-bottom: 10px;">
          <label>Correo: </label>
          <input type="email" [(ngModel)]="correo" name="correo" required>
        </div>
        <div style="margin-bottom: 10px;">
          <label>Contraseña: </label>
          <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  `
})
export class LoginFormComponent {
  titulo = input<string>('Iniciar sesión');
  correo = '';
  password = '';
  loginEnviado = output<Credenciales>();

  enviarLogin() {
    this.loginEnviado.emit({ correo: this.correo, password: this.password });
  }
}
