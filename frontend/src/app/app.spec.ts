import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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

  it('muestra el nav con Login y Usuarios', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const enlaces = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('nav a'),
      (a) => a.textContent?.trim(),
    );
    expect(enlaces).toEqual(['Login', 'Usuarios']);
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
