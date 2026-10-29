package com.example.demo.dto;

import com.example.demo.entities.Pago;
import com.example.demo.entities.Reserva;

public record ReservaConPago(Reserva reserva, Pago pago) {
}
