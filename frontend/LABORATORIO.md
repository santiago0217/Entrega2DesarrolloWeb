# Laboratorio Angular – Login y gestión de Usuarios

Proyecto BarberBook. Todas las rutas son relativas a `frontend/src/app/`.

## (a) Tabla de archivos

| Elemento              | Rol                 | Clase            | Archivos                                                                 |
| --------------------- | ------------------- | ---------------- | ------------------------------------------------------------------------ |
| Login                 | Padre               | `LoginPage`      | `pages/login-page/login-page.ts`, `.html`, `.css`                        |
| Login                 | Hijo                | `LoginForm`      | `components/login-form/login-form.ts`, `.html`, `.css`, `.spec.ts`       |
| Formulario de Usuario | Padre               | `UsuariosPage`   | `pages/usuarios-page/usuarios-page.ts`, `.html`, `.css`                  |
| Formulario de Usuario | Hijo                | `UsuarioForm`    | `components/usuario-form/usuario-form.ts`, `.html`, `.css`, `.spec.ts`   |
| Modelo Usuario        | Interfaces          | `Usuario`, `Credenciales`, `Rol` | `models/usuario.model.ts`                                |
| Servicio de Usuario   | Servicio (`root`)   | `UsuarioService` | `services/usuario.service.ts`, `services/usuario.service.spec.ts`        |

Apoyo: `app.ts` / `app.html` (raíz con nav y `<router-outlet>`), `app.routes.ts`
(`''` → `login`, `login` → `LoginPage`, `usuarios` → `UsuariosPage`) y
`services/sesion.service.ts` (recuerda solo el correo para el saludo "Bienvenido, …").

## (b) Preguntas de control

1. **¿Quién es el padre y quién el hijo en el login?**
   El padre es `LoginPage` (`pages/login-page`) y el hijo es `LoginForm`
   (`components/login-form`, selector `app-login-form`). El padre usa al hijo en su plantilla.

2. **¿Qué dato va por `input()`?**
   El título del formulario: `titulo = input<string>('Iniciar sesión')`. El padre lo envía con
   `[titulo]="'Ingreso a BarberBook'"` y el hijo lo muestra con `{{ titulo() }}`.

3. **¿Qué regresa por `output()` / `emit()`?**
   Un objeto `Credenciales` `{ correo, password }`. El hijo declara
   `loginEnviado = output<Credenciales>()` y en `enviarLogin()` llama
   `this.loginEnviado.emit({ correo, password })`.

4. **¿Qué contiene `$event`?**
   El valor que el hijo pasó a `emit()`. En `(loginEnviado)="procesarLogin($event)"` es el objeto
   `Credenciales`; en `(usuarioGuardado)="guardarUsuario($event)"` es el objeto `Usuario`.

5. **¿Qué responsabilidad tiene `UsuarioService`?**
   Guardar y entregar los usuarios, separado de los componentes: mantiene un arreglo temporal en
   un signal privado, `agregarUsuario(usuario)` añade uno y `obtenerUsuarios()` devuelve la lista
   en modo de solo lectura. Todavía no hace llamadas HTTP.

6. **¿Qué hace `inject(UsuarioService)`?**
   Le pide al inyector de Angular la instancia del servicio. Como es `providedIn: 'root'`, es una
   sola instancia compartida por toda la aplicación. `UsuariosPage` la obtiene con
   `private usuarioService = inject(UsuarioService)` en lugar de usar el constructor.

## (c) Puntos de control

### Punto de control 1 – Login padre-hijo

- [x] Existe el padre `LoginPage` y el hijo `LoginForm` (selector `app-login-form`).
- [x] El hijo recibe `titulo` con `input()` y lo muestra con `{{ titulo() }}`.
- [x] El formulario usa `FormsModule`, `[(ngModel)]`, `name` y `(ngSubmit)="enviarLogin()"`.
- [x] El hijo emite `Credenciales` con `output()` y `emit({ correo, password })`.
- [x] El padre escucha con `(loginEnviado)="procesarLogin($event)"`.
- [x] La contraseña no se imprime con `console.log` ni se guarda.
- [x] La interface `Credenciales` está en `models/usuario.model.ts`.

### Punto de control 2 – Formulario de Usuario

- [x] La interface `Usuario` tiene los campos de la entidad del backend
      (`id?`, `nombre`, `correo`, `password`, `telefono`, `rol`, `barberia?`, `activo`).
- [x] `UsuarioForm` tiene una variable por campo, con `[(ngModel)]` y `name` en cada control.
- [x] El formulario usa `<form (ngSubmit)="guardar()">`.
- [x] Hay un `@if` que muestra "Debe ingresar el nombre del usuario" cuando el nombre está vacío.
- [x] `guardar()` arma el `Usuario`, lo emite por `usuarioGuardado = output<Usuario>()` y limpia el formulario.
- [x] El padre `UsuariosPage` escucha con `(usuarioGuardado)="guardarUsuario($event)"`.

### Punto de control 3 – Servicio con `inject()`

- [x] `UsuarioService` es `providedIn: 'root'` y guarda un arreglo temporal.
- [x] Tiene `agregarUsuario(usuario)` y `obtenerUsuarios()`.
- [x] `UsuariosPage` lo obtiene con `inject(UsuarioService)`.
- [x] `guardarUsuario()` llama a `agregarUsuario()`.
- [x] La lista se muestra con `@for (u of usuarios(); track u.id ?? u.correo)` como
      nombre - correo - rol, sin la contraseña.

## Cómo ejecutarlo

```bash
cd frontend
npm install
npm start      # http://localhost:4200
npm test       # Vitest
npm run build
```
