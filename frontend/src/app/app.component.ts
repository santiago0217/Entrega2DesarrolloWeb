import { Component } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { Credenciales } from './models/usuario.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginFormComponent],
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Sistema de Login</h1>

      <!-- Invoca al Hijo pasando input y escuchando output -->
      <app-login-form
        [titulo]="'Ingreso al Sistema de Barbería'"
        (loginEnviado)="procesarLogin($event)">
      </app-login-form>
    </div>
  `
})
export class AppComponent {
  procesarLogin(credenciales: Credenciales) {
    console.log('Credenciales recibidas desde el hijo ($event):', credenciales);
  }
}
