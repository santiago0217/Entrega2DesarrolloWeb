import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usuario } from '../../models/usuario.model';
import { UsuarioForm } from './usuario-form';

describe('UsuarioForm', () => {
  let fixture: ComponentFixture<UsuarioForm>;
  let elemento: HTMLElement;
  let emitidos: Usuario[];

  function escribir(selector: string, valor: string) {
    const control = elemento.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
    control.value = valor;
    control.dispatchEvent(new Event(control instanceof HTMLSelectElement ? 'change' : 'input'));
  }

  async function enviar() {
    await fixture.whenStable();
    elemento.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioForm);
    elemento = fixture.nativeElement;
    emitidos = [];
    fixture.componentInstance.usuarioGuardado.subscribe((u) => emitidos.push(u));
    await fixture.whenStable();
  });

  it('emite un Usuario con los datos del formulario y lo limpia', async () => {
    escribir('input[name="nombre"]', 'Ana Gomez');
    escribir('input[name="correo"]', 'ana@barberbook.com');
    escribir('input[name="password"]', 'secreta');
    escribir('input[name="telefono"]', '3001234567');
    escribir('select[name="rol"]', 'BARBERO');
    await enviar();

    expect(emitidos).toEqual([
      {
        nombre: 'Ana Gomez',
        correo: 'ana@barberbook.com',
        password: 'secreta',
        telefono: '3001234567',
        rol: 'BARBERO',
        barberia: null,
        activo: true,
      },
    ]);
    expect(elemento.querySelector<HTMLInputElement>('input[name="nombre"]')!.value).toBe('');
    expect(elemento.querySelector<HTMLSelectElement>('select[name="rol"]')!.value).toBe('CLIENTE');
  });

  it('no emite si el correo no termina en .com (misma regla que Usuario.java)', async () => {
    escribir('input[name="nombre"]', 'Ana Gomez');
    escribir('input[name="correo"]', 'ana@barberbook.co');
    escribir('input[name="password"]', 'secreta');
    escribir('input[name="telefono"]', '3001234567');
    await enviar();

    expect(emitidos).toEqual([]);
    expect(elemento.textContent).toContain('terminar en .com');
  });

  it('pide la barbería a los barberos cuando recibe la lista de barberías', async () => {
    fixture.componentRef.setInput('barberias', [
      { id: 1, nombre: 'Barberia la 45', direccion: '', telefono: '', horario: '', activo: true },
    ]);
    escribir('input[name="nombre"]', 'Pedro Perez');
    escribir('input[name="correo"]', 'pedro@gmail.com');
    escribir('input[name="password"]', '1234');
    escribir('input[name="telefono"]', '3001234567');
    escribir('select[name="rol"]', 'BARBERO');
    await enviar();
    expect(emitidos).toEqual([]);
    expect(elemento.textContent).toContain('Debes asignar una barbería');

    const barberia = elemento.querySelector<HTMLSelectElement>('select[name="barberia"]')!;
    barberia.selectedIndex = 1;
    barberia.dispatchEvent(new Event('change'));
    await enviar();
    expect(emitidos[0].barberia).toEqual({ id: 1 });
  });

  it('al editar conserva el id y permite dejar la contraseña vacía', async () => {
    fixture.componentRef.setInput('registro', {
      id: 9,
      nombre: 'Valentina Ruiz',
      correo: 'valentina@gmail.com',
      password: '',
      telefono: '3106678899',
      rol: 'CLIENTE',
      barberia: null,
      activo: true,
    });
    await fixture.whenStable();
    escribir('input[name="telefono"]', '3100000000');
    await enviar();

    expect(emitidos).toEqual([
      expect.objectContaining({ id: 9, password: '', telefono: '3100000000' }),
    ]);
  });

  it('no emite y muestra el mensaje cuando el nombre está vacío', async () => {
    escribir('input[name="correo"]', 'ana@barberbook.com');
    await enviar();

    expect(emitidos).toEqual([]);
    expect(elemento.querySelector('.error')?.textContent).toContain(
      'Debe ingresar el nombre del usuario',
    );
  });
});
