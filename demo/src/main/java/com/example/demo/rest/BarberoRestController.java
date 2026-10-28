package com.example.demo.rest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Reserva;
import com.example.demo.entities.Usuario;
import com.example.demo.service.ReservaService;

import jakarta.servlet.http.HttpSession;

// Equivalente REST de BarberoController
@RestController
@RequestMapping("/api/barbero")
public class BarberoRestController {

    private final ReservaService reservaService;

    public BarberoRestController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping("/reservas")
    public List<Reserva> misReservas(HttpSession sesion) {
        return reservaService.findByBarberoId(barbero(sesion).getId());
    }

    // GET /api/barbero/agenda?fecha=2026-10-27 (sin fecha: hoy)
    @GetMapping("/agenda")
    public List<Reserva> agenda(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
                                HttpSession sesion) {
        return reservaService.findByBarberoIdAndFecha(barbero(sesion).getId(),
                fecha == null ? LocalDate.now() : fecha);
    }

    private Usuario barbero(HttpSession sesion) {
        return (Usuario) sesion.getAttribute("usuario");
    }
}
