import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Credenciales } from '../../models/usuario.model';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
  let fixture: ComponentFixture<LoginForm>;
  let elemento: HTMLElement;

  function escribir(selector: string, valor: string) {
    const input = elemento.querySelector<HTMLInputElement>(selector)!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    elemento = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('muestra el título por defecto', () => {
    expect(elemento.querySelector('h2')?.textContent).toContain('Iniciar sesión');
  });

  it('muestra el título recibido por input()', async () => {
    fixture.componentRef.setInput('titulo', 'Ingreso a BarberBook');
    await fixture.whenStable();

    expect(elemento.querySelector('h2')?.textContent).toContain('Ingreso a BarberBook');
  });

  it('emite las credenciales al enviar el formulario', async () => {
    const emitidos: Credenciales[] = [];
    fixture.componentInstance.loginEnviado.subscribe((c) => emitidos.push(c));

    escribir('input[name="correo"]', 'ana@barberbook.com');
    escribir('input[name="password"]', 'secreta');
    elemento.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(emitidos).toEqual([{ correo: 'ana@barberbook.com', password: 'secreta' }]);
  });
});
