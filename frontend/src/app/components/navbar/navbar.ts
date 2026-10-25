import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  protected readonly titulo = 'BarberBook';
  protected readonly logo = 'logo.svg';

  protected readonly enlaces = [
    { ruta: '/inicio', texto: 'Inicio' },
    { ruta: '/servicios', texto: 'Servicios' },
    { ruta: '/barberias', texto: 'Barberías' },
    { ruta: '/login', texto: 'Login' },
    { ruta: '/usuarios', texto: 'Usuarios' },
  ];

  // Se muestra al pasar el mouse sobre el logo
  protected readonly mensaje = signal('');

  mostrarMensaje(): void {
    this.mensaje.set('Reserva tu corte en línea');
  }

  ocultarMensaje(): void {
    this.mensaje.set('');
  }
}
