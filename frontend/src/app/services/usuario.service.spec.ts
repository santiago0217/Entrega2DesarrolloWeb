import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

const URL = 'http://localhost:8081/api/admin/usuarios';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let http: HttpTestingController;

  const ana: Usuario = {
    nombre: 'Ana Gomez',
    correo: 'ana@barberbook.com',
    password: 'secreta',
    telefono: '3001234567',
    rol: 'CLIENTE',
    activo: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UsuarioService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista los usuarios y filtra por rol', () => {
    service.listar().subscribe();
    service.listar('BARBERO').subscribe();

    http.expectOne(URL).flush([]);
    http.expectOne(`${URL}?rol=BARBERO`).flush([]);
  });

  it('crea con POST y actualiza con PUT', () => {
    let creado: Usuario | undefined;
    service.crear(ana).subscribe((u) => (creado = u));
    service.actualizar(7, { ...ana, id: 7 }).subscribe();

    const post = http.expectOne({ method: 'POST', url: URL });
    expect(post.request.body).toEqual(ana);
    post.flush({ ...ana, id: 7 });
    http.expectOne({ method: 'PUT', url: `${URL}/7` }).flush({ ...ana, id: 7 });

    expect(creado?.id).toBe(7);
  });

  it('activa y desactiva con PATCH', () => {
    service.cambiarEstado(3, false).subscribe();
    service.cambiarEstado(3, true).subscribe();

    http.expectOne({ method: 'PATCH', url: `${URL}/3/desactivar` }).flush(null);
    http.expectOne({ method: 'PATCH', url: `${URL}/3/activar` }).flush(null);
  });
});
