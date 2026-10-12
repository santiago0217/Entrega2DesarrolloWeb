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
];
