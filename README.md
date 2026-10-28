# ProyectoDesarrolloWeb

Santiago Silva Caliman -
Santiago Martínez Cuellar

## BarberBook

Sistema de reservas para barberías con cuatro roles: administrador, gerente, barbero y cliente.

| Carpeta     | Qué es                                              | Puerto |
| ----------- | --------------------------------------------------- | ------ |
| `demo/`     | Backend Spring Boot: API REST `/api` con PostgreSQL | 8081   |
| `frontend/` | Frontend Angular que consume la API REST            | 4200   |

El login de Angular guarda el usuario en la sesión del backend (`HttpSession`), y
`ApiAutenticacionInterceptor` aplica las reglas por rol a `/api/admin/...`, `/api/gerente/...`, etc.

## Cómo ejecutarlo

Terminal 1 (backend, usa PostgreSQL: base `barberbook`, usuario `postgres`, clave `admin`):

```bash
cd demo
./mvnw spring-boot:run
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

| Ruta                                                 | Acceso        | Controlador                                     |
| ---------------------------------------------------- | ------------- | ----------------------------------------------- |
| `/api/auth/login`, `/registro`, `/sesion`, `/logout` | público       | `AuthRestController`                            |
| `/api/servicios`, `/api/barberias`                   | público       | `ServicioRestController`, `BarberiaRestController` |
| `/api/admin/...`                                     | ADMINISTRADOR | `AdminRestController`, `UsuarioRestController`, `EspacioRestController`, `ReservaRestController`, `PagoRestController` |
| `/api/gerente/...`                                   | GERENTE       | `GerenteRestController`                         |
| `/api/barbero/...`                                   | BARBERO       | `BarberoRestController`                         |
| `/api/cliente/...`                                   | CLIENTE       | `ClienteRestController`                         |

Sin sesión la API responde `401`; con otro rol, `403`. Los errores de validación y de negocio
(horario ocupado, pago repetido, correo repetido, barbería desactivada) llegan en JSON y Angular
muestra el mensaje del backend.

## Pruebas

```bash
cd frontend && npm test -- --watch=false
cd demo && ./mvnw test   # necesita PostgreSQL corriendo
```
