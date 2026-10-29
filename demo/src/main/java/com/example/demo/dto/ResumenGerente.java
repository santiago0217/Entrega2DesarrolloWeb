package com.example.demo.dto;

import com.example.demo.entities.Barberia;

public record ResumenGerente(Barberia barberia, int totalBarberos, int totalServicios,
                             int totalEspacios, int totalReservas, Double totalRecaudado) {
}
