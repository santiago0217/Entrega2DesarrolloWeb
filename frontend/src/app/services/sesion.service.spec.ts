import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { credencialesInterceptor } from '../interceptors/credenciales.interceptor';
import { Usuario } from '../models/usuario.model';
import { mensajeError } from './mensaje-error';
import { SesionService, rutaInicio } from './sesion.service';

const API = 'http://localhost:8081/api';

const laura: Usuario = {
  id: 3,
  nombre: 'Laura Restrepo',
  correo: 'laura@gmail.com',
  password: '',
  telefono: '3009998877',
  rol: 'GERENTE',
  barberia: { id: 1, nombre: 'Barberia la 45' },
  activo: true,
};

describe('SesionService', () => {
  let sesion: SesionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([credencialesInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    sesion = TestBed.inject(SesionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('guarda el usuario al iniciar sesión y envía la cookie de sesión', () => {
    sesion.login({ correo: 'laura@gmail.com', password: 'gerente123' }).subscribe();

    const req = http.expectOne(`${API}/auth/login`);
    expect(req.request.withCredentials).toBe(true);
    req.flush(laura);

    expect(sesion.usuario()?.rol).toBe('GERENTE');
    expect(sesion.correo()).toBe('laura@gmail.com');
  });

  it('restaurar() devuelve null si el backend no tiene la sesión', () => {
    let resultado: Usuario | null | undefined;
    sesion.restaurar().subscribe((u) => (resultado = u));

    http.expectOne(`${API}/auth/sesion`).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(resultado).toBeNull();
    expect(sesion.usuario()).toBeNull();
  });

  it('logout() limpia el usuario', () => {
    sesion.login({ correo: 'laura@gmail.com', password: 'gerente123' }).subscribe();
    http.expectOne(`${API}/auth/login`).flush(laura);

    sesion.logout().subscribe();
    http.expectOne(`${API}/auth/logout`).flush(null);

    expect(sesion.usuario()).toBeNull();
  });

  it('cada rol tiene su página de inicio', () => {
    expect(rutaInicio('ADMINISTRADOR')).toBe('/admin');
    expect(rutaInicio('GERENTE')).toBe('/gerente');
    expect(rutaInicio('BARBERO')).toBe('/barbero');
    expect(rutaInicio('CLIENTE')).toBe('/cliente');
  });

  it('mensajeError muestra el mensaje o las validaciones que envía el backend', () => {
    const conflicto = new HttpErrorResponse({
      status: 409,
      error: { mensaje: 'El barbero ya tiene una reserva para esa fecha y hora. Elige otro horario.' },
    });
    const validacion = new HttpErrorResponse({
      status: 400,
      error: { nombre: 'El nombre es obligatorio', precio: 'El precio debe ser mayor a 0' },
    });

    expect(mensajeError(conflicto)).toContain('El barbero ya tiene una reserva');
    expect(mensajeError(validacion)).toBe('El nombre es obligatorio. El precio debe ser mayor a 0');
    expect(mensajeError(new HttpErrorResponse({ status: 0 }))).toBe('No hay conexión con el servidor');
  });
});
