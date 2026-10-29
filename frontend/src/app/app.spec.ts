import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { App } from './app';
import { routes } from './app.routes';
import { credencialesInterceptor } from './interceptors/credenciales.interceptor';
import { Barberia } from './models/barberia.model';
import { Servicio } from './models/servicio.model';
import { Rol, Usuario } from './models/usuario.model';
import { SesionService } from './services/sesion.service';

const API = 'http://localhost:8081/api';

const barberias: Barberia[] = [
  {
    id: 1,
    nombre: 'Barberia la 45',
    direccion: 'Calle 45',
    telefono: '6012345678',
    horario: '9-19',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Chamos',
    direccion: 'Carrera 7',
    telefono: '6019876543',
    horario: '10-20',
    activo: true,
  },
  {
    id: 3,
    nombre: 'Del Parque',
    direccion: 'Calle 93',
    telefono: '6015554433',
    horario: '8-18',
    activo: false,
  },
];

const servicios: Servicio[] = [
  {
    id: 1,
    nombre: 'Corte Clásico',
    descripcion: '',
    precio: 25000,
    activo: true,
    barberia: barberias[0],
  },
  {
    id: 2,
    nombre: 'Corte y Barba',
    descripcion: '',
    precio: 40000,
    activo: true,
    barberia: barberias[0],
  },
  {
    id: 3,
    nombre: 'Masaje Capilar',
    descripcion: '',
    precio: 15000,
    activo: false,
    barberia: barberias[1],
  },
];

function usuario(rol: Rol): Usuario {
  return {
    id: 1,
    nombre: 'Santiago Silva',
    correo: 'admin@gmail.com',
    password: '',
    telefono: '3001112233',
    rol,
    barberia: null,
    activo: true,
  };
}

describe('App', () => {
  let http: HttpTestingController;

  function iniciarSesion(rol: Rol): void {
    TestBed.inject(SesionService).login({ correo: 'admin@gmail.com', password: 'x' }).subscribe();
    http.expectOne(`${API}/auth/login`).flush(usuario(rol));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptors([credencialesInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  function textosDelMenu(fixture: { nativeElement: HTMLElement }): (string | undefined)[] {
    return Array.from(fixture.nativeElement.querySelectorAll('nav a'), (a) => a.textContent?.trim());
  }

  it('sin sesión el navbar muestra los enlaces públicos', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(textosDelMenu(fixture)).toEqual(['Inicio', 'Login', 'Registro']);
  });

  it('con sesión el navbar muestra los enlaces del rol y el botón Salir', async () => {
    iniciarSesion('GERENTE');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(textosDelMenu(fixture)).toEqual([
      'Mi barbería',
      'Reservas',
      'Agenda',
      'Barberos',
      'Servicios',
      'Espacios',
      'Pagos',
    ]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Salir');
  });

  it('marca con la clase activo el enlace de la ruta actual', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/login');
    await fixture.whenStable();

    const activos = (fixture.nativeElement as HTMLElement).querySelectorAll('nav a.activo');
    expect(activos.length).toBe(1);
    expect(activos[0].textContent?.trim()).toBe('Login');
  });

  it('sin sesión, el guard manda al login', async () => {
    const router = TestBed.inject(Router);
    const navegacion = router.navigateByUrl('/admin');
    await vi.waitFor(() =>
      http.expectOne(`${API}/auth/sesion`).flush(null, { status: 401, statusText: 'Unauthorized' }),
    );
    await navegacion;

    expect(router.url).toBe('/login');
  });

  it('con otro rol, el guard manda a la página de ese rol', async () => {
    iniciarSesion('CLIENTE');
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/admin');

    expect(router.url).toBe('/cliente');
  });

  it('muestra en /admin/servicios la página que devuelve el backend', async () => {
    iniciarSesion('ADMINISTRADOR');
    const harness = await RouterTestingHarness.create('/admin/servicios');

    expect(harness.routeNativeElement?.textContent).toContain('Cargando...');
    http
      .expectOne(`${API}/servicios?page=0&size=5`)
      .flush({ content: servicios, number: 0, size: 5, totalPages: 4, totalElements: 18 });
    await harness.fixture.whenStable();

    const texto = harness.routeNativeElement?.textContent;
    expect(harness.routeNativeElement?.querySelectorAll('tbody tr').length).toBe(3);
    expect(texto).toContain('Total de registros: 18');
    expect(texto).toContain('Página 1 de 4');
    expect(texto).toContain('CORTE CLÁSICO');
    http.verify();
  });

  it('muestra "No hay conexión con el servidor" si el backend no responde', async () => {
    iniciarSesion('ADMINISTRADOR');
    const harness = await RouterTestingHarness.create('/admin/servicios');

    http
      .expectOne(`${API}/servicios?page=0&size=5`)
      .error(new ProgressEvent('error'), { status: 0 });
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.textContent).toContain('No hay conexión con el servidor');
  });

  it('muestra en /admin/barberias las barberías del backend', async () => {
    iniciarSesion('ADMINISTRADOR');
    const harness = await RouterTestingHarness.create('/admin/barberias');

    http.expectOne(`${API}/barberias`).flush(barberias);
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.querySelectorAll('tbody tr').length).toBe(3);
    expect(harness.routeNativeElement?.textContent).toContain('Inactiva');
  });

  it('redirige la ruta vacía a /login', async () => {
    const harness = await RouterTestingHarness.create('/');

    expect(harness.routeNativeElement?.querySelector('app-login-form')).toBeTruthy();
  });

  it('lista en /admin/usuarios los usuarios del backend sin mostrar la contraseña', async () => {
    iniciarSesion('ADMINISTRADOR');
    const harness = await RouterTestingHarness.create('/admin/usuarios');

    http.expectOne(`${API}/admin/usuarios`).flush([
      { ...usuario('GERENTE'), id: 3, nombre: 'Ana Gomez', correo: 'ana@barberbook.com', barberia: barberias[0] },
    ]);
    http.expectOne(`${API}/admin/usuarios/resumen-roles`).flush([{ rol: 'GERENTE', total: 1 }]);
    http.expectOne(`${API}/barberias`).flush(barberias);
    await harness.fixture.whenStable();

    const filas = harness.routeNativeElement?.querySelectorAll('tbody tr') ?? [];
    expect(filas.length).toBe(1);
    expect(filas[0].textContent).toContain('Ana Gomez');
    expect(filas[0].textContent).toContain('ana@barberbook.com');
    expect(filas[0].textContent).toContain('Barberia la 45');
  });
});
