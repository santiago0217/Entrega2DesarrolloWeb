package com.example.demo.dto;

import java.util.List;

import com.example.demo.entities.Barberia;
import com.example.demo.entities.Servicio;
import com.example.demo.entities.Usuario;

// Lo que ve el cliente al entrar a una barbería
public record DetalleBarberia(Barberia barberia, List<Servicio> servicios, List<Usuario> barberos) {
}
