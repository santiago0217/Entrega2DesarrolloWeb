import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Rol } from '../../models/usuario.model';
import { SesionService } from '../../services/sesion.service';

interface Enlace {
  ruta: string;
  texto: string;
}

// Mismos enlaces por rol que fragments/nav.html de Thymeleaf
const ENLACES: Record<Rol, Enlace[]> = {
  ADMINISTRADOR: [
    { ruta: '/admin', texto: 'Panel' },
    { ruta: '/admin/barberias', texto: 'Barberías' },
    { ruta: '/admin/usuarios', texto: 'Usuarios' },
    { ruta: '/admin/servicios', texto: 'Servicios' },
    { ruta: '/admin/espacios', texto: 'Espacios' },
    { ruta: '/admin/reservas', texto: 'Reservas' },
    { ruta: '/admin/pagos', texto: 'Pagos' },
    { ruta: '/admin/reportes', texto: 'Reportes' },
  ],
  GERENTE: [
    { ruta: '/gerente', texto: 'Mi barbería' },
    { ruta: '/gerente/reservas', texto: 'Reservas' },
    { ruta: '/gerente/agenda', texto: 'Agenda' },
    { ruta: '/gerente/barberos', texto: 'Barberos' },
    { ruta: '/gerente/servicios', texto: 'Servicios' },
    { ruta: '/gerente/espacios', texto: 'Espacios' },
    { ruta: '/gerente/pagos', texto: 'Pagos' },
  ],
  BARBERO: [
    { ruta: '/barbero', texto: 'Mis reservas' },
    { ruta: '/barbero/agenda', texto: 'Mi agenda' },
  ],
  CLIENTE: [
    { ruta: '/cliente', texto: 'Barberías' },
    { ruta: '/cliente/reservas', texto: 'Mis reservas' },
  ],
};

const ENLACES_PUBLICOS: Enlace[] = [
  { ruta: '/inicio', texto: 'Inicio' },
  { ruta: '/login', texto: 'Login' },
  { ruta: '/registro', texto: 'Registro' },
];

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private sesion = inject(SesionService);
  private router = inject(Router);

  protected readonly titulo = 'BarberBook';
  protected readonly logo = 'logo.svg';

  protected readonly usuario = this.sesion.usuario;
  protected readonly enlaces = computed(() => {
    const usuario = this.usuario();
    return usuario ? ENLACES[usuario.rol] : ENLACES_PUBLICOS;
  });

  // Se muestra al pasar el mouse sobre el logo
  protected readonly mensaje = signal('');

  mostrarMensaje(): void {
    this.mensaje.set('Reserva tu corte en línea');
  }

  ocultarMensaje(): void {
    this.mensaje.set('');
  }

  salir(): void {
    this.sesion.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
