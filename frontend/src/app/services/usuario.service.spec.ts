import { TestBed } from '@angular/core/testing';

import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;

  const ana: Usuario = {
    nombre: 'Ana Gomez',
    correo: 'ana@barberbook.com',
    password: 'secreta',
    telefono: '3001234567',
    rol: 'CLIENTE',
    activo: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioService);
  });

  it('empieza sin usuarios', () => {
    expect(service.obtenerUsuarios()()).toEqual([]);
  });

  it('agrega usuarios y los devuelve en orden', () => {
    const usuarios = service.obtenerUsuarios();

    service.agregarUsuario(ana);
    service.agregarUsuario({ ...ana, nombre: 'Luis Rojas', correo: 'luis@barberbook.com' });

    expect(usuarios().map((u) => u.correo)).toEqual(['ana@barberbook.com', 'luis@barberbook.com']);
  });

  it('asigna un id distinto a cada usuario nuevo', () => {
    service.agregarUsuario(ana);
    service.agregarUsuario(ana);

    const ids = service.obtenerUsuarios()().map((u) => u.id);
    expect(new Set(ids).size).toBe(2);
  });
});
