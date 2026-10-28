package com.example.demo.rest;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ResumenAdmin;
import com.example.demo.dto.ResumenBarberia;
import com.example.demo.entities.Rol;
import com.example.demo.service.BarberiaService;
import com.example.demo.service.PagoService;
import com.example.demo.service.ReservaService;
import com.example.demo.service.ServicioService;
import com.example.demo.service.UsuarioService;

// Equivalente REST de AdminController
@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final BarberiaService barberiaService;
    private final UsuarioService usuarioService;
    private final ServicioService servicioService;
    private final ReservaService reservaService;
    private final PagoService pagoService;

    public AdminRestController(BarberiaService barberiaService, UsuarioService usuarioService,
                               ServicioService servicioService, ReservaService reservaService,
                               PagoService pagoService) {
        this.barberiaService = barberiaService;
        this.usuarioService = usuarioService;
        this.servicioService = servicioService;
        this.reservaService = reservaService;
        this.pagoService = pagoService;
    }

    @GetMapping("/resumen")
    public ResumenAdmin resumen() {
        return new ResumenAdmin(
                barberiaService.obtenerTodas().size(),
                usuarioService.buscarTodos().size(),
                usuarioService.buscarPorRol(Rol.BARBERO).size(),
                servicioService.findAll().size(),
                reservaService.findAll().size());
    }

    // GET /api/admin/reportes?minimo=100000
    @GetMapping("/reportes")
    public List<ResumenBarberia> reportes(@RequestParam(defaultValue = "100000") Double minimo) {
        return pagoService.buscarBarberiasConIngresosMayoresA(minimo);
    }
}
