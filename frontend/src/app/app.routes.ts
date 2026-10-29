import { Routes } from '@angular/router';

import { rolGuard } from './guards/rol.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    title: 'Login | BarberBook',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    title: 'Registro | BarberBook',
    loadComponent: () => import('./pages/registro-page/registro-page').then((m) => m.RegistroPage),
  },
  {
    path: 'inicio',
    title: 'Inicio | BarberBook',
    loadComponent: () => import('./components/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'admin',
    canActivate: [rolGuard('ADMINISTRADOR')],
    children: [
      {
        path: '',
        title: 'Panel | BarberBook',
        loadComponent: () => import('./pages/admin/admin-panel/admin-panel').then((m) => m.AdminPanel),
      },
      {
        path: 'barberias',
        title: 'Barberías | BarberBook',
        loadComponent: () =>
          import('./components/lista-barberia/lista-barberia').then((m) => m.ListaBarberia),
      },
      {
        path: 'usuarios',
        title: 'Usuarios | BarberBook',
        loadComponent: () => import('./pages/usuarios-page/usuarios-page').then((m) => m.UsuariosPage),
      },
      {
        path: 'servicios',
        title: 'Servicios | BarberBook',
        loadComponent: () =>
          import('./components/lista-servicio/lista-servicio').then((m) => m.ListaServicio),
      },
      {
        path: 'servicios/nuevo',
        title: 'Nuevo servicio | BarberBook',
        loadComponent: () =>
          import('./components/form-servicio/form-servicio').then((m) => m.FormServicio),
      },
      {
        path: 'espacios',
        title: 'Espacios | BarberBook',
        loadComponent: () =>
          import('./pages/admin/admin-espacios/admin-espacios').then((m) => m.AdminEspacios),
      },
      {
        path: 'reservas',
        title: 'Reservas | BarberBook',
        loadComponent: () =>
          import('./pages/admin/admin-reservas/admin-reservas').then((m) => m.AdminReservas),
      },
      {
        path: 'reservas/nueva',
        title: 'Nueva reserva | BarberBook',
        loadComponent: () =>
          import('./pages/admin/admin-reserva-form/admin-reserva-form').then((m) => m.AdminReservaForm),
      },
      {
        path: 'reservas/:id',
        title: 'Detalle de reserva | BarberBook',
        loadComponent: () =>
          import('./pages/admin/admin-reserva-detalle/admin-reserva-detalle').then(
            (m) => m.AdminReservaDetalle,
          ),
      },
      {
        path: 'reservas/:id/editar',
        title: 'Editar reserva | BarberBook',
        loadComponent: () =>
          import('./pages/admin/admin-reserva-form/admin-reserva-form').then((m) => m.AdminReservaForm),
      },
      {
        path: 'pagos',
        title: 'Pagos | BarberBook',
        loadComponent: () => import('./pages/admin/admin-pagos/admin-pagos').then((m) => m.AdminPagos),
      },
      {
        path: 'pagos/nuevo',
        title: 'Registrar pago | BarberBook',
        loadComponent: () =>
          import('./pages/admin/admin-pago-form/admin-pago-form').then((m) => m.AdminPagoForm),
      },
      {
        path: 'pagos/:id/editar',
        title: 'Editar pago | BarberBook',
        loadComponent: () =>
          import('./pages/admin/admin-pago-form/admin-pago-form').then((m) => m.AdminPagoForm),
      },
      {
        path: 'reportes',
        title: 'Reportes | BarberBook',
        loadComponent: () =>
          import('./pages/admin/admin-reportes/admin-reportes').then((m) => m.AdminReportes),
      },
    ],
  },
  {
    path: 'gerente',
    canActivate: [rolGuard('GERENTE')],
    children: [
      {
        path: '',
        title: 'Mi barbería | BarberBook',
        loadComponent: () =>
          import('./pages/gerente/gerente-panel/gerente-panel').then((m) => m.GerentePanel),
      },
      {
        path: 'reservas',
        title: 'Reservas | BarberBook',
        loadComponent: () =>
          import('./pages/gerente/gerente-reservas/gerente-reservas').then((m) => m.GerenteReservas),
      },
      {
        path: 'agenda',
        title: 'Agenda | BarberBook',
        loadComponent: () =>
          import('./pages/gerente/gerente-agenda/gerente-agenda').then((m) => m.GerenteAgenda),
      },
      {
        path: 'barberos',
        title: 'Barberos | BarberBook',
        loadComponent: () =>
          import('./pages/gerente/gerente-barberos/gerente-barberos').then((m) => m.GerenteBarberos),
      },
      {
        path: 'servicios',
        title: 'Servicios | BarberBook',
        loadComponent: () =>
          import('./pages/gerente/gerente-servicios/gerente-servicios').then((m) => m.GerenteServicios),
      },
      {
        path: 'espacios',
        title: 'Espacios | BarberBook',
        loadComponent: () =>
          import('./pages/gerente/gerente-espacios/gerente-espacios').then((m) => m.GerenteEspacios),
      },
      {
        path: 'pagos',
        title: 'Pagos | BarberBook',
        loadComponent: () =>
          import('./pages/gerente/gerente-pagos/gerente-pagos').then((m) => m.GerentePagos),
      },
    ],
  },
  {
    path: 'barbero',
    canActivate: [rolGuard('BARBERO')],
    children: [
      {
        path: '',
        title: 'Mis reservas | BarberBook',
        loadComponent: () =>
          import('./pages/barbero/barbero-reservas/barbero-reservas').then((m) => m.BarberoReservas),
      },
      {
        path: 'agenda',
        title: 'Mi agenda | BarberBook',
        loadComponent: () =>
          import('./pages/barbero/barbero-agenda/barbero-agenda').then((m) => m.BarberoAgenda),
      },
    ],
  },
  {
    path: 'cliente',
    canActivate: [rolGuard('CLIENTE')],
    children: [
      {
        path: '',
        title: 'Barberías | BarberBook',
        loadComponent: () =>
          import('./pages/cliente/cliente-barberias/cliente-barberias').then((m) => m.ClienteBarberias),
      },
      {
        path: 'barberias/:id',
        title: 'Barbería | BarberBook',
        loadComponent: () =>
          import('./pages/cliente/cliente-barberia/cliente-barberia').then((m) => m.ClienteBarberia),
      },
      {
        path: 'reservas',
        title: 'Mis reservas | BarberBook',
        loadComponent: () =>
          import('./pages/cliente/cliente-reservas/cliente-reservas').then((m) => m.ClienteReservas),
      },
      {
        path: 'reservar/:servicioId',
        title: 'Reservar | BarberBook',
        loadComponent: () =>
          import('./pages/cliente/cliente-reservar/cliente-reservar').then((m) => m.ClienteReservar),
      },
      {
        path: 'pagar/:reservaId',
        title: 'Pagar | BarberBook',
        loadComponent: () =>
          import('./pages/cliente/cliente-pagar/cliente-pagar').then((m) => m.ClientePagar),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
