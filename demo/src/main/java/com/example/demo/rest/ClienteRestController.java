package com.example.demo.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.DetalleBarberia;
import com.example.demo.dto.OpcionesReserva;
import com.example.demo.dto.ReservaConPago;
import com.example.demo.entities.Barberia;
import com.example.demo.entities.Pago;
import com.example.demo.entities.Reserva;
import com.example.demo.entities.Servicio;
import com.example.demo.entities.Usuario;
import com.example.demo.exception.BarberiaInactivaException;
import com.example.demo.exception.RecursoNoEncontradoException;
import com.example.demo.service.BarberiaService;
import com.example.demo.service.EspacioService;
import com.example.demo.service.PagoService;
import com.example.demo.service.ReservaService;
import com.example.demo.service.ServicioService;
import com.example.demo.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

// Equivalente REST de ClienteController. Las reservas y pagos son siempre del cliente de la sesión.
@RestController
@RequestMapping("/api/cliente")
public class ClienteRestController {

    private final BarberiaService barberiaService;
    private final ServicioService servicioService;
    private final EspacioService espacioService;
    private final UsuarioService usuarioService;
    private final ReservaService reservaService;
    private final PagoService pagoService;
    private final Validacion validacion;

    public ClienteRestController(BarberiaService barberiaService, ServicioService servicioService,
                                 EspacioService espacioService, UsuarioService usuarioService,
                                 ReservaService reservaService, PagoService pagoService,
                                 Validacion validacion) {
        this.barberiaService = barberiaService;
        this.servicioService = servicioService;
        this.espacioService = espacioService;
        this.usuarioService = usuarioService;
        this.reservaService = reservaService;
        this.pagoService = pagoService;
        this.validacion = validacion;
    }

    @GetMapping("/barberias")
    public List<Barberia> barberias() {
        return barberiaService.obtenerActivas();
    }

    @GetMapping("/barberias/{id}")
    public DetalleBarberia verBarberia(@PathVariable Long id) {
        Barberia barberia = barberiaService.obtenerPorId(id);
        if (barberia == null) {
            throw new RecursoNoEncontradoException("No existe una barbería con id " + id);
        }
        verificarBarberiaActiva(barberia);
        return new DetalleBarberia(barberia, servicioService.findByBarberiaId(id),
                usuarioService.buscarBarberosDeBarberia(id));
    }

    // GET /api/cliente/reservas/opciones?servicioId=1: servicio elegido con sus barberos y espacios
    @GetMapping("/reservas/opciones")
    public OpcionesReserva opciones(@RequestParam Integer servicioId) {
        Servicio servicio = buscarServicio(servicioId);
        Long barberiaId = servicio.getBarberia().getId();
        return new OpcionesReserva(servicio, null,
                usuarioService.buscarBarberosDeBarberia(barberiaId), null,
                espacioService.obtenerPorBarberia(barberiaId));
    }

    @GetMapping("/reservas")
    public List<ReservaConPago> misReservas(HttpSession sesion) {
        return reservaService.findByUsuarioId(cliente(sesion).getId()).stream()
                .map(reserva -> new ReservaConPago(reserva, pagoService.findByReservaId(reserva.getId())))
                .toList();
    }

    @GetMapping("/reservas/{id}")
    public ReservaConPago verReserva(@PathVariable Long id, HttpSession sesion) {
        Reserva reserva = reservaPropia(id, sesion);
        return new ReservaConPago(reserva, pagoService.findByReservaId(id));
    }

    // El JSON trae servicio, barbero y espacio por id; el cliente es siempre el de la sesión
    @PostMapping("/reservas")
    public ResponseEntity<Reserva> reservar(@RequestBody Reserva datos, HttpSession sesion) {
        Servicio servicio = buscarServicio(datos.getServicio() == null ? null : datos.getServicio().getId());
        Long barberiaId = servicio.getBarberia().getId();

        Reserva reserva = new Reserva();
        reserva.setUsuario(cliente(sesion));
        reserva.setServicio(servicio);
        // Solo se aceptan barberos y espacios activos de la misma barbería
        reserva.setBarbero(usuarioService.buscarBarberosDeBarberia(barberiaId).stream()
                .filter(b -> datos.getBarbero() != null && b.getId().equals(datos.getBarbero().getId()))
                .findFirst().orElse(null));
        reserva.setEspacio(espacioService.obtenerPorBarberia(barberiaId).stream()
                .filter(e -> datos.getEspacio() != null && e.getId().equals(datos.getEspacio().getId()))
                .findFirst().orElse(null));
        reserva.setFecha(datos.getFecha());
        reserva.setHora(datos.getHora());
        validacion.validar(reserva);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservaService.save(reserva));
    }

    @DeleteMapping("/reservas/{id}")
    public ResponseEntity<Void> cancelarReserva(@PathVariable Long id, HttpSession sesion) {
        reservaPropia(id, sesion);
        reservaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // El monto siempre es el precio del servicio, como en el formulario (campo de solo lectura)
    @PostMapping("/pagos")
    public ResponseEntity<Pago> pagar(@RequestBody Pago datos, HttpSession sesion) {
        if (datos.getReserva() == null || datos.getReserva().getId() == null) {
            throw new RecursoNoEncontradoException("Debe seleccionar una reserva");
        }
        Reserva reserva = reservaPropia(datos.getReserva().getId(), sesion);
        Pago pago = new Pago();
        pago.setReserva(reserva);
        pago.setMonto(reserva.getServicio().getPrecio());
        pago.setMetodoPago(datos.getMetodoPago());
        pago.setEstado(datos.getEstado());
        validacion.validar(pago);
        return ResponseEntity.status(HttpStatus.CREATED).body(pagoService.save(pago));
    }

    private Servicio buscarServicio(Integer id) {
        Servicio servicio = id == null ? null : servicioService.findById(id);
        if (servicio == null) {
            throw new RecursoNoEncontradoException("No existe el servicio seleccionado");
        }
        verificarBarberiaActiva(servicio.getBarberia());
        return servicio;
    }

    private Reserva reservaPropia(Long id, HttpSession sesion) {
        Reserva reserva = reservaService.findById(id);
        if (reserva == null || !reserva.getUsuario().getId().equals(cliente(sesion).getId())) {
            throw new RecursoNoEncontradoException("No existe una reserva con id " + id);
        }
        return reserva;
    }

    private void verificarBarberiaActiva(Barberia barberia) {
        if (!barberia.getActivo()) {
            throw new BarberiaInactivaException(
                    "La barbería " + barberia.getNombre() + " no está disponible en este momento.");
        }
    }

    private Usuario cliente(HttpSession sesion) {
        return (Usuario) sesion.getAttribute("usuario");
    }
}
