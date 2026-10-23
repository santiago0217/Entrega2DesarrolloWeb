import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { App } from './app';
import { routes } from './app.routes';
import { UsuarioService } from './services/usuario.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
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

  it('muestra en /servicios los 3 servicios de prueba', async () => {
    const harness = await RouterTestingHarness.create('/servicios');

    expect(harness.routeNativeElement?.querySelectorAll('tbody tr').length).toBe(3);
    expect(harness.routeNativeElement?.textContent).toContain('Total de registros: 3');
  });

  it('muestra en /barberias las 3 barberías de prueba', async () => {
    const harness = await RouterTestingHarness.create('/barberias');

    expect(harness.routeNativeElement?.querySelectorAll('tbody tr').length).toBe(3);
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
