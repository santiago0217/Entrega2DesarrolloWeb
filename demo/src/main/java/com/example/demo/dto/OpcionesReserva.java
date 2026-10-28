package com.example.demo.dto;

import java.util.List;

import com.example.demo.entities.Espacio;
import com.example.demo.entities.Servicio;
import com.example.demo.entities.Usuario;

// Opciones de los selectores del formulario de reserva.
// El administrador recibe todas; el cliente recibe el servicio elegido con sus barberos y espacios.
public record OpcionesReserva(Servicio servicio, List<Usuario> clientes, List<Usuario> barberos,
                              List<Servicio> servicios, List<Espacio> espacios) {
}
