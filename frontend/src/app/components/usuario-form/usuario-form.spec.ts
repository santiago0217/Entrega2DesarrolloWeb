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
    // Como en el navegador: Angular procesa lo escrito antes de que llegue el submit.
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
        activo: true,
      },
    ]);
    expect(elemento.querySelector<HTMLInputElement>('input[name="nombre"]')!.value).toBe('');
    expect(elemento.querySelector<HTMLSelectElement>('select[name="rol"]')!.value).toBe('CLIENTE');
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
