package com.example.demo.rest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ReservaConPago;
import com.example.demo.dto.ResumenGerente;
import com.example.demo.entities.Barberia;
import com.example.demo.entities.Espacio;
import com.example.demo.entities.Pago;
import com.example.demo.entities.Reserva;
import com.example.demo.entities.Rol;
import com.example.demo.entities.Servicio;
import com.example.demo.entities.Usuario;
import com.example.demo.service.AccesoGerente;
import com.example.demo.service.EspacioService;
import com.example.demo.service.PagoService;
import com.example.demo.service.ReservaService;
import com.example.demo.service.ServicioService;
import com.example.demo.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/gerente")
public class GerenteRestController {

    private final ReservaService reservaService;
    private final PagoService pagoService;
    private final ServicioService servicioService;
    private final UsuarioService usuarioService;
    private final EspacioService espacioService;
    private final AccesoGerente accesoGerente;
    private final EdicionUsuario edicionUsuario;
    private final Validacion validacion;

    public GerenteRestController(ReservaService reservaService, PagoService pagoService,
                                 ServicioService servicioService, UsuarioService usuarioService,
                                 EspacioService espacioService, AccesoGerente accesoGerente,
                                 EdicionUsuario edicionUsuario, Validacion validacion) {
        this.reservaService = reservaService;
        this.pagoService = pagoService;
        this.servicioService = servicioService;
        this.usuarioService = usuarioService;
        this.espacioService = espacioService;
        this.accesoGerente = accesoGerente;
        this.edicionUsuario = edicionUsuario;
        this.validacion = validacion;
    }

    @GetMapping("/resumen")
    public ResumenGerente resumen(HttpSession sesion) {
        Barberia barberia = accesoGerente.barberia(gerente(sesion));
        return new ResumenGerente(barberia,
                usuarioService.buscarTodosLosBarberosDeBarberia(barberia.getId()).size(),
                servicioService.findTodosPorBarberiaId(barberia.getId()).size(),
                espacioService.obtenerTodosPorBarberia(barberia.getId()).size(),
                reservaService.findByBarberiaId(barberia.getId()).size(),
                pagoService.totalRecaudado(barberia.getId()));
    }

    @GetMapping("/reservas")
    public List<ReservaConPago> reservas(HttpSession sesion) {
        Barberia barberia = accesoGerente.barberia(gerente(sesion));
        return reservaService.findByBarberiaId(barberia.getId()).stream()
                .map(reserva -> new ReservaConPago(reserva, pagoService.findByReservaId(reserva.getId())))
                .toList();
    }

    @GetMapping("/agenda")
    public List<Reserva> agenda(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
                                HttpSession sesion) {
        Barberia barberia = accesoGerente.barberia(gerente(sesion));
        return reservaService.findByBarberiaIdAndFecha(barberia.getId(), fecha == null ? LocalDate.now() : fecha);
    }

    @GetMapping("/pagos")
    public List<Pago> pagos(HttpSession sesion) {
        return pagoService.findByBarberiaId(accesoGerente.barberia(gerente(sesion)).getId());
    }

    @GetMapping("/servicios")
    public List<Servicio> servicios(HttpSession sesion) {
        return servicioService.findTodosPorBarberiaId(accesoGerente.barberia(gerente(sesion)).getId());
    }

    @PostMapping("/servicios")
    public ResponseEntity<Servicio> crearServicio(@RequestBody Servicio datos, HttpSession sesion) {
        Barberia barberia = accesoGerente.barberiaActiva(gerente(sesion));
        return ResponseEntity.status(HttpStatus.CREATED).body(guardarServicio(new Servicio(), datos, barberia));
    }

    @PutMapping("/servicios/{id}")
    public Servicio actualizarServicio(@PathVariable Integer id, @RequestBody Servicio datos, HttpSession sesion) {
        Barberia barberia = accesoGerente.barberiaActiva(gerente(sesion));
        return guardarServicio(accesoGerente.servicio(id, gerente(sesion)), datos, barberia);
    }

    @PatchMapping("/servicios/{id}/desactivar")
    public ResponseEntity<Void> desactivarServicio(@PathVariable Integer id, HttpSession sesion) {
        accesoGerente.barberiaActiva(gerente(sesion));
        accesoGerente.servicio(id, gerente(sesion));
        servicioService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/servicios/{id}/activar")
    public ResponseEntity<Void> activarServicio(@PathVariable Integer id, HttpSession sesion) {
        accesoGerente.barberiaActiva(gerente(sesion));
        accesoGerente.servicio(id, gerente(sesion));
        servicioService.activar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/espacios")
    public List<Espacio> espacios(HttpSession sesion) {
        return espacioService.obtenerTodosPorBarberia(accesoGerente.barberia(gerente(sesion)).getId());
    }

    @PostMapping("/espacios")
    public ResponseEntity<Espacio> crearEspacio(@RequestBody Espacio datos, HttpSession sesion) {
        Barberia barberia = accesoGerente.barberiaActiva(gerente(sesion));
        return ResponseEntity.status(HttpStatus.CREATED).body(guardarEspacio(new Espacio(), datos, barberia));
    }

    @PutMapping("/espacios/{id}")
    public Espacio actualizarEspacio(@PathVariable Long id, @RequestBody Espacio datos, HttpSession sesion) {
        Barberia barberia = accesoGerente.barberiaActiva(gerente(sesion));
        return guardarEspacio(accesoGerente.espacio(id, gerente(sesion)), datos, barberia);
    }

    @PatchMapping("/espacios/{id}/desactivar")
    public ResponseEntity<Void> desactivarEspacio(@PathVariable Long id, HttpSession sesion) {
        accesoGerente.barberiaActiva(gerente(sesion));
        accesoGerente.espacio(id, gerente(sesion));
        espacioService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/espacios/{id}/activar")
    public ResponseEntity<Void> activarEspacio(@PathVariable Long id, HttpSession sesion) {
        accesoGerente.barberiaActiva(gerente(sesion));
        accesoGerente.espacio(id, gerente(sesion));
        espacioService.activar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/barberos")
    public List<Usuario> barberos(HttpSession sesion) {
        return usuarioService.buscarTodosLosBarberosDeBarberia(accesoGerente.barberia(gerente(sesion)).getId());
    }

    @PostMapping("/barberos")
    public ResponseEntity<Usuario> crearBarbero(@RequestBody Usuario datos, HttpSession sesion) {
        Barberia barberia = accesoGerente.barberiaActiva(gerente(sesion));
        return ResponseEntity.status(HttpStatus.CREATED).body(guardarBarbero(new Usuario(), datos, barberia));
    }

    @PutMapping("/barberos/{id}")
    public Usuario actualizarBarbero(@PathVariable Long id, @RequestBody Usuario datos, HttpSession sesion) {
        Barberia barberia = accesoGerente.barberiaActiva(gerente(sesion));
        return guardarBarbero(accesoGerente.barbero(id, gerente(sesion)), datos, barberia);
    }

    @PatchMapping("/barberos/{id}/desactivar")
    public ResponseEntity<Void> desactivarBarbero(@PathVariable Long id, HttpSession sesion) {
        accesoGerente.barberiaActiva(gerente(sesion));
        accesoGerente.barbero(id, gerente(sesion));
        usuarioService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/barberos/{id}/activar")
    public ResponseEntity<Void> activarBarbero(@PathVariable Long id, HttpSession sesion) {
        accesoGerente.barberiaActiva(gerente(sesion));
        accesoGerente.barbero(id, gerente(sesion));
        usuarioService.activar(id);
        return ResponseEntity.noContent().build();
    }

    private Servicio guardarServicio(Servicio servicio, Servicio datos, Barberia barberia) {
        servicio.setNombre(datos.getNombre());
        servicio.setDescripcion(datos.getDescripcion());
        servicio.setPrecio(datos.getPrecio());
        servicio.setBarberia(barberia);
        if (datos.getActivo() != null) {
            servicio.setActivo(datos.getActivo());
        }
        validacion.validar(servicio);
        return servicioService.save(servicio);
    }

    private Espacio guardarEspacio(Espacio espacio, Espacio datos, Barberia barberia) {
        espacio.setNombre(datos.getNombre());
        espacio.setCapacidad(datos.getCapacidad());
        espacio.setBarberia(barberia);
        if (datos.getActivo() != null) {
            espacio.setActivo(datos.getActivo());
        }
        validacion.validar(espacio);
        return espacioService.guardar(espacio);
    }

    private Usuario guardarBarbero(Usuario barbero, Usuario datos, Barberia barberia) {
        datos.setRol(Rol.BARBERO);
        datos.setBarberia(barberia);
        edicionUsuario.aplicar(barbero, datos);
        usuarioService.guardar(barbero);
        return barbero;
    }

    private Usuario gerente(HttpSession sesion) {
        return (Usuario) sesion.getAttribute("usuario");
    }
}
