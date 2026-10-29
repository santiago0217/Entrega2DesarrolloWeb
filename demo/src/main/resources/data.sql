INSERT INTO barberia (nombre, direccion, telefono, horario, activo)
VALUES ('Barberia la 45', 'Calle 45 #12-30, Bogotá', '6012345678', 'Lunes a Sábado 9:00 - 19:00', true);

INSERT INTO barberia (nombre, direccion, telefono, horario, activo)
VALUES ('Chamos Barbershop', 'Carrera 7 #80-15, Bogotá', '6019876543', 'Martes a Domingo 10:00 - 20:00', true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Santiago Silva', 'admin@gmail.com', 'admin123', '3001112233', 'ADMINISTRADOR', NULL, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Santiago Martínez', 'admin2@gmail.com', 'admin123', '3001112244', 'ADMINISTRADOR', NULL, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Laura Restrepo', 'laura@gmail.com', 'gerente123', '3009998877', 'GERENTE', 1, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Daniel Castro', 'daniel@gmail.com', 'gerente123', '3008887766', 'GERENTE', 2, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Andrés Gómez', 'andres@gmail.com', 'barbero123', '3002223344', 'BARBERO', 1, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Felipe Ramírez', 'felipe@gmail.com', 'barbero123', '3003334455', 'BARBERO', 1, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Felipe', 'user', 'user', '3003334455', 'CLIENTE', NULL, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Camilo Rojas', 'camilo@gmail.com', 'barbero123', '3004445566', 'BARBERO', 2, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Julián Mora', 'julian@gmail.com', 'barbero123', '3005556677', 'BARBERO', 2, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Valentina Ruiz', 'valentina@gmail.com', 'cliente123', '3106678899', 'CLIENTE', NULL, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Mateo Cárdenas', 'mateo@gmail.com', 'cliente123', '3117745566', 'CLIENTE', NULL, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Isabella Ortiz', 'isabella@gmail.com', 'cliente123', '3123312244', 'CLIENTE', NULL, true);

INSERT INTO usuario (nombre, correo, password, telefono, rol, barberia_id, activo)
VALUES ('Samuel Peña', 'samuel@gmail.com', 'cliente123', '3139986677', 'CLIENTE', NULL, true);

INSERT INTO espacio (barberia_id, nombre, capacidad, activo)
VALUES (1, 'Silla 1', 1, true);

INSERT INTO espacio (barberia_id, nombre, capacidad, activo)
VALUES (1, 'Silla 2', 1, true);

INSERT INTO espacio (barberia_id, nombre, capacidad, activo)
VALUES (1, 'Silla 3', 1, true);

INSERT INTO espacio (barberia_id, nombre, capacidad, activo)
VALUES (1, 'Silla 4', 1, true);

INSERT INTO espacio (barberia_id, nombre, capacidad, activo)
VALUES (2, 'Silla 1', 1, true);

INSERT INTO espacio (barberia_id, nombre, capacidad, activo)
VALUES (2, 'Silla 2', 1, true);

INSERT INTO espacio (barberia_id, nombre, capacidad, activo)
VALUES (2, 'Silla 3', 1, true);

INSERT INTO espacio (barberia_id, nombre, capacidad, activo)
VALUES (2, 'Silla 4', 1, true);

INSERT INTO espacio (barberia_id, nombre, capacidad, activo)
VALUES (2, 'Zona de Lavado', 2, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (1, 'Corte Clásico', 'Corte con tijera o máquina y acabado con navaja', 25000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (1, 'Corte y Barba', 'Corte completo más perfilado de barba con toalla caliente', 40000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (1, 'Afeitado a Navaja', 'Afeitado tradicional con navaja y aceites esenciales', 22000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (1, 'Arreglo de Barba', 'Perfilado, hidratación y aplicación de bálsamo', 18000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (2, 'Corte Fade', 'Degradado a máquina con difuminado y diseño de líneas', 30000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (2, 'Corte y Barba Premium', 'Corte fade, diseño de barba y ritual de toalla caliente', 48000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (2, 'Diseño de Barba', 'Perfilado a navaja con delineado y color opcional', 20000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (2, 'Corte Infantil', 'Corte para niños menores de 12 años', 20000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (1, 'Corte Infantil', 'Corte para niños con máquina y tijera', 18000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (1, 'Tinte de Barba', 'Aplicación de color para cubrir canas', 28000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (1, 'Limpieza Facial', 'Limpieza con vapor y mascarilla', 35000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (1, 'Masaje Capilar', 'Masaje relajante con aceites', 15000.0, false);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (1, 'Paquete Novio', 'Corte, barba, limpieza facial y peinado', 90000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (2, 'Corte Clásico', 'Corte tradicional con tijera y acabado a navaja', 26000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (2, 'Afeitado Clásico', 'Afeitado con toalla caliente y navaja', 24000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (2, 'Mascarilla Negra', 'Limpieza de puntos negros y poros', 22000.0, true);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (2, 'Tinte de Cabello', 'Cambio de color completo', 60000.0, false);

INSERT INTO servicio (barberia_id, nombre, descripcion, precio, activo)
VALUES (2, 'Paquete Premium', 'Corte fade, barba, mascarilla y masaje', 85000.0, true);

INSERT INTO reserva (usuario_id, barbero_id, servicio_id, espacio_id, fecha, hora)
VALUES (9, 5, 2, 1, '2027-03-15', '10:00:00');

INSERT INTO reserva (usuario_id, barbero_id, servicio_id, espacio_id, fecha, hora)
VALUES (10, 6, 1, 2, '2027-03-15', '11:00:00');

INSERT INTO reserva (usuario_id, barbero_id, servicio_id, espacio_id, fecha, hora)
VALUES (11, 5, 3, 1, '2027-03-16', '09:00:00');

INSERT INTO reserva (usuario_id, barbero_id, servicio_id, espacio_id, fecha, hora)
VALUES (9, 6, 4, 3, '2027-03-16', '15:00:00');

INSERT INTO reserva (usuario_id, barbero_id, servicio_id, espacio_id, fecha, hora)
VALUES (12, 7, 5, 5, '2027-03-15', '14:00:00');

INSERT INTO reserva (usuario_id, barbero_id, servicio_id, espacio_id, fecha, hora)
VALUES (10, 8, 6, 6, '2027-03-17', '16:00:00');

INSERT INTO pago (reserva_id, monto, metodo_pago, estado)
VALUES (1, 40000.0, 'Efectivo', 'COMPLETADO');

INSERT INTO pago (reserva_id, monto, metodo_pago, estado)
VALUES (2, 25000.0, 'Tarjeta de Crédito', 'COMPLETADO');

INSERT INTO pago (reserva_id, monto, metodo_pago, estado)
VALUES (3, 22000.0, 'Transferencia', 'COMPLETADO');

INSERT INTO pago (reserva_id, monto, metodo_pago, estado)
VALUES (4, 18000.0, 'Efectivo', 'COMPLETADO');

INSERT INTO pago (reserva_id, monto, metodo_pago, estado)
VALUES (5, 30000.0, 'Efectivo', 'COMPLETADO');
