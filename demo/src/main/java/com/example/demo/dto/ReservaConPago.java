package com.example.demo.dto;

import com.example.demo.entities.Pago;
import com.example.demo.entities.Reserva;

// Una reserva con su pago (null si todavía no se ha pagado)
public record ReservaConPago(Reserva reserva, Pago pago) {
}
