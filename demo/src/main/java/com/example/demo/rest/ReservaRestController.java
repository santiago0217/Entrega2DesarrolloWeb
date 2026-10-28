package com.example.demo.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.OpcionesReserva;
import com.example.demo.dto.ReservaConPago;
import com.example.demo.entities.Reserva;
import com.example.demo.entities.Rol;
import com.example.demo.exception.RecursoNoEncontradoException;
import com.example.demo.service.EspacioService;
import com.example.demo.service.PagoService;
import com.example.demo.service.ReservaService;
import com.example.demo.service.ServicioService;
import com.example.demo.service.UsuarioService;

// Equivalente REST de ReservaController
@RestController
@RequestMapping("/api/admin/reservas")
public class ReservaRestController {

    private final ReservaService reservaService;
    private final UsuarioService usuarioService;
    private final EspacioService espacioService;
    private final PagoService pagoService;
    private final ServicioService servicioService;
    private final Validacion validacion;

    public ReservaRestController(ReservaService reservaService, UsuarioService usuarioService,
                                 EspacioService espacioService, PagoService pagoService,
                                 ServicioService servicioService, Validacion validacion) {
        this.reservaService = reservaService;
        this.usuarioService = usuarioService;
        this.espacioService = espacioService;
        this.pagoService = pagoService;
        this.servicioService = servicioService;
        this.validacion = validacion;
    }

    // GET /api/admin/reservas?usuarioId=3
    @GetMapping
    public List<ReservaConPago> listar(@RequestParam(required = false) Long usuarioId) {
        List<Reserva> reservas = usuarioId != null
                ? reservaService.findByUsuarioId(usuarioId)
                : reservaService.findAll();
        return reservas.stream()
                .map(reserva -> new ReservaConPago(reserva, pagoService.findByReservaId(reserva.getId())))
                .toList();
    }

    // Opciones de los selectores del formulario (las mismas de cargarOpciones en ReservaController)
    @GetMapping("/opciones")
    public OpcionesReserva opciones() {
        return new OpcionesReserva(null,
                usuarioService.buscarPorRol(Rol.CLIENTE),
                usuarioService.buscarPorRol(Rol.BARBERO),
                servicioService.findAll(),
                espacioService.obtenerActivos());
    }

    @GetMapping("/{id}")
    public ReservaConPago obtener(@PathVariable Long id) {
        return new ReservaConPago(buscar(id), pagoService.findByReservaId(id));
    }

    @PostMapping
    public ResponseEntity<Reserva> crear(@RequestBody Reserva datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(guardar(new Reserva(), datos));
    }

    @PutMapping("/{id}")
    public Reserva actualizar(@PathVariable Long id, @RequestBody Reserva datos) {
        return guardar(buscar(id), datos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        buscar(id);
        reservaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // El JSON trae solo los ids ({ "barbero": { "id": 5 } }); se buscan los registros completos
    private Reserva guardar(Reserva reserva, Reserva datos) {
        reserva.setUsuario(datos.getUsuario() == null || datos.getUsuario().getId() == null
                ? null : usuarioService.buscarPorId(datos.getUsuario().getId()));
        reserva.setBarbero(datos.getBarbero() == null || datos.getBarbero().getId() == null
                ? null : usuarioService.buscarPorId(datos.getBarbero().getId()));
        reserva.setServicio(datos.getServicio() == null || datos.getServicio().getId() == null
                ? null : servicioService.findById(datos.getServicio().getId()));
        reserva.setEspacio(datos.getEspacio() == null || datos.getEspacio().getId() == null
                ? null : espacioService.obtenerPorId(datos.getEspacio().getId()));
        reserva.setFecha(datos.getFecha());
        reserva.setHora(datos.getHora());
        validacion.validar(reserva);
        return reservaService.save(reserva);
    }

    private Reserva buscar(Long id) {
        Reserva reserva = reservaService.findById(id);
        if (reserva == null) {
            throw new RecursoNoEncontradoException("No existe una reserva con id " + id);
        }
        return reserva;
    }
}
