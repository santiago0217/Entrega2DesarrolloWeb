import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    title: 'Login | BarberBook',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'usuarios',
    title: 'Usuarios | BarberBook',
    loadComponent: () => import('./pages/usuarios-page/usuarios-page').then((m) => m.UsuariosPage),
  },
  {
    path: 'inicio',
    title: 'Inicio | BarberBook',
    loadComponent: () => import('./components/inicio/inicio').then((m) => m.Inicio),
  },
  // Entidad A: Servicio
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
  // Entidad B: Barbería
  {
    path: 'barberias',
    title: 'Barberías | BarberBook',
    loadComponent: () =>
      import('./components/lista-barberia/lista-barberia').then((m) => m.ListaBarberia),
  },
];
