package com.example.demo.dto;

import java.util.List;

import com.example.demo.entities.Barberia;
import com.example.demo.entities.Servicio;
import com.example.demo.entities.Usuario;

public record DetalleBarberia(Barberia barberia, List<Servicio> servicios, List<Usuario> barberos) {
}
