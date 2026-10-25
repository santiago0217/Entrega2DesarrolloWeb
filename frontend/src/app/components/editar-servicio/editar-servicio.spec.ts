import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Servicio } from '../../models/servicio.model';
import { EditarServicio } from './editar-servicio';

describe('EditarServicio', () => {
  let fixture: ComponentFixture<EditarServicio>;
  let elemento: HTMLElement;
  let emitidos: Servicio[];

  const registro: Servicio = {
    id: 7,
    nombre: 'Corte Clásico',
    descripcion: 'Con tijera',
    precio: 25000,
    activo: true,
    barberia: {
      id: 1,
      nombre: 'Barberia la 45',
      direccion: '',
      telefono: '',
      horario: '',
      activo: true,
    },
  };

  function escribir(selector: string, valor: string) {
    const control = elemento.querySelector<HTMLInputElement>(selector)!;
    control.value = valor;
    control.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarServicio],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarServicio);
    fixture.componentRef.setInput('registro', registro);
    elemento = fixture.nativeElement;
    emitidos = [];
    fixture.componentInstance.guardado.subscribe((s) => emitidos.push(s));
    await fixture.whenStable();
  });

  it('muestra los datos que recibe por input()', () => {
    expect(elemento.querySelector<HTMLInputElement>('input[name="nombre"]')!.value).toBe(
      'Corte Clásico',
    );
  });

  it('devuelve el registro modificado con output()', async () => {
    escribir('input[name="nombre"]', 'Corte Moderno');
    escribir('input[name="precio"]', '30000');
    await fixture.whenStable();
    elemento.querySelector('form')!.dispatchEvent(new Event('submit'));

    expect(emitidos).toEqual([{ ...registro, nombre: 'Corte Moderno', precio: 30000 }]);
  });

  it('desactiva Guardar si el nombre tiene menos de 3 letras', async () => {
    escribir('input[name="nombre"]', 'ab');
    await fixture.whenStable();

    expect(elemento.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(true);
    expect(elemento.textContent).toContain('al menos 3 caracteres');
  });
});
