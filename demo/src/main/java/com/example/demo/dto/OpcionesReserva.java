package com.example.demo.dto;

import java.util.List;

import com.example.demo.entities.Espacio;
import com.example.demo.entities.Servicio;
import com.example.demo.entities.Usuario;

public record OpcionesReserva(Servicio servicio, List<Usuario> clientes, List<Usuario> barberos,
                              List<Servicio> servicios, List<Espacio> espacios) {
}
