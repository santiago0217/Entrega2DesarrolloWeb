import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { App } from './app';
import { routes } from './app.routes';
import { Barberia } from './models/barberia.model';
import { Servicio } from './models/servicio.model';
import { UsuarioService } from './services/usuario.service';

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

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('muestra el navbar con los enlaces de todas las secciones', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const enlaces = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('nav a'),
      (a) => a.textContent?.trim(),
    );
    expect(enlaces).toEqual(['Inicio', 'Servicios', 'Barberías', 'Login', 'Usuarios']);
  });

  it('marca con la clase activo el enlace de la ruta actual', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/servicios');
    await fixture.whenStable();

    const activos = (fixture.nativeElement as HTMLElement).querySelectorAll('nav a.activo');
    expect(activos.length).toBe(1);
    expect(activos[0].textContent?.trim()).toBe('Servicios');
  });

  it('muestra en /servicios la página que devuelve el backend', async () => {
    const harness = await RouterTestingHarness.create('/servicios');
    const http = TestBed.inject(HttpTestingController);

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
    const harness = await RouterTestingHarness.create('/servicios');
    const http = TestBed.inject(HttpTestingController);

    http
      .expectOne(`${API}/servicios?page=0&size=5`)
      .error(new ProgressEvent('error'), { status: 0 });
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.textContent).toContain('No hay conexión con el servidor');
  });

  it('muestra en /barberias las barberías del backend', async () => {
    const harness = await RouterTestingHarness.create('/barberias');
    const http = TestBed.inject(HttpTestingController);

    http.expectOne(`${API}/barberias`).flush(barberias);
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.querySelectorAll('tbody tr').length).toBe(3);
    expect(harness.routeNativeElement?.textContent).toContain('Inactiva');
  });

  it('redirige la ruta vacía a /login', async () => {
    const harness = await RouterTestingHarness.create('/');

    expect(harness.routeNativeElement?.querySelector('app-login-form')).toBeTruthy();
  });

  it('lista en /usuarios los usuarios guardados en el servicio', async () => {
    const harness = await RouterTestingHarness.create('/usuarios');
    TestBed.inject(UsuarioService).agregarUsuario({
      nombre: 'Ana Gomez',
      correo: 'ana@barberbook.com',
      password: 'secreta',
      telefono: '3001234567',
      rol: 'GERENTE',
      activo: true,
    });
    await harness.fixture.whenStable();

    const items = harness.routeNativeElement?.querySelectorAll('.lista li') ?? [];
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Ana Gomez - ana@barberbook.com - GERENTE');
    expect(items[0].textContent).not.toContain('secreta');
  });
});
