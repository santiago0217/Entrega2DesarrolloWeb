# ProyectoDesarrolloWeb

Santiago Silva Caliman -
Santiago Martínez Cuellar

## BarberBook

Sistema de reservas para barberías con cuatro roles: administrador, gerente, barbero y cliente.

| Carpeta     | Qué es                                                                          | Puerto |
| ----------- | ------------------------------------------------------------------------------- | ------ |
| `demo/`     | Backend Spring Boot: vistas Thymeleaf (Entrega 1) y API REST `/api` (Entrega 2) | 8081   |
| `frontend/` | Frontend Angular que consume la API REST                                        | 4200   |

Las dos interfaces usan **los mismos servicios y la misma base de datos**. El login de Angular guarda
el usuario en la misma sesión (`HttpSession`) que el login de Thymeleaf, y los interceptores del backend
aplican las mismas reglas por rol a `/admin/...` y a `/api/admin/...`.

## Cómo ejecutarlo

Terminal 1 (backend, usa PostgreSQL: base `barberbook`, usuario `postgres`, clave `admin`):

```bash
cd demo
./mvnw spring-boot:run
# sin PostgreSQL: ./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

Terminal 2 (frontend):

```bash
cd frontend
npm install   # solo la primera vez
npm start     # http://localhost:4200
```

La base se crea y se llena con `data.sql` cada vez que arranca el backend (`create-drop`).

## Usuarios de prueba

| Rol           | Correo              | Contraseña |
| ------------- | ------------------- | ---------- |
| Administrador | admin@gmail.com     | admin123   |
| Gerente       | laura@gmail.com     | gerente123 |
| Barbero       | andres@gmail.com    | barbero123 |
| Cliente       | valentina@gmail.com | cliente123 |

## API REST

| Ruta                                    | Acceso        | Equivale a                         |
| --------------------------------------- | ------------- | ---------------------------------- |
| `/api/auth/login`, `/registro`, `/sesion`, `/logout` | público | `AuthController`         |
| `/api/servicios`, `/api/barberias`      | público       | CRUD de las entidades A y B        |
| `/api/admin/...`                        | ADMINISTRADOR | `AdminController`, `UsuarioController`, `EspacioController`, `ReservaController`, `PagoController` |
| `/api/gerente/...`                      | GERENTE       | `GerenteController`                |
| `/api/barbero/...`                      | BARBERO       | `BarberoController`                |
| `/api/cliente/...`                      | CLIENTE       | `ClienteController`                |

Sin sesión la API responde `401`; con otro rol, `403`. Los errores de validación y de negocio
(horario ocupado, pago repetido, correo repetido, barbería desactivada) llegan en JSON y Angular
muestra el mensaje del backend.

## Pruebas

```bash
cd frontend && npm test -- --watch=false
cd demo && ./mvnw test   # usa H2
```
