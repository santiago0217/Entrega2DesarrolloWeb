package com.example.demo.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.entities.Barberia;
import com.example.demo.entities.Espacio;
import com.example.demo.entities.Pago;
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
import jakarta.validation.Valid;

@Controller
@RequestMapping("/gerente")
public class GerenteController {

    private final ReservaService reservaService;
    private final PagoService pagoService;
    private final ServicioService servicioService;
    private final UsuarioService usuarioService;
    private final EspacioService espacioService;
    private final AccesoGerente accesoGerente;

    public GerenteController(ReservaService reservaService, PagoService pagoService,
                             ServicioService servicioService, UsuarioService usuarioService,
                             EspacioService espacioService, AccesoGerente accesoGerente) {
        this.reservaService = reservaService;
        this.pagoService = pagoService;
        this.servicioService = servicioService;
        this.usuarioService = usuarioService;
        this.espacioService = espacioService;
        this.accesoGerente = accesoGerente;
    }

    @GetMapping
    public String panel(HttpSession sesion, Model model) {
        Barberia barberia = barberiaEnSesion(sesion);
        model.addAttribute("barberia", barberia);
        model.addAttribute("totalBarberos", usuarioService.buscarTodosLosBarberosDeBarberia(barberia.getId()).size());
        model.addAttribute("totalServicios", servicioService.findTodosPorBarberiaId(barberia.getId()).size());
        model.addAttribute("totalEspacios", espacioService.obtenerTodosPorBarberia(barberia.getId()).size());
        model.addAttribute("totalReservas", reservaService.findByBarberiaId(barberia.getId()).size());
        model.addAttribute("totalRecaudado", pagoService.totalRecaudado(barberia.getId()));
        return "gerente_panel";
    }

    @GetMapping("/reservas")
    public String reservas(HttpSession sesion, Model model) {
        Barberia barberia = barberiaEnSesion(sesion);
        model.addAttribute("barberia", barberia);
        model.addAttribute("reservas", reservaService.findByBarberiaId(barberia.getId()));
        model.addAttribute("pagos", pagosPorReserva(barberia.getId()));
        return "gerente_reservas";
    }

    @GetMapping("/agenda")
    public String agenda(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
                         HttpSession sesion, Model model) {
        Barberia barberia = barberiaEnSesion(sesion);
        LocalDate dia = fecha == null ? LocalDate.now() : fecha;
        model.addAttribute("barberia", barberia);
        model.addAttribute("fecha", dia);
        model.addAttribute("reservas", reservaService.findByBarberiaIdAndFecha(barberia.getId(), dia));
        return "gerente_agenda";
    }

    @GetMapping("/pagos")
    public String pagos(HttpSession sesion, Model model) {
        Barberia barberia = barberiaEnSesion(sesion);
        model.addAttribute("barberia", barberia);
        model.addAttribute("pagos", pagoService.findByBarberiaId(barberia.getId()));
        model.addAttribute("totalRecaudado", pagoService.totalRecaudado(barberia.getId()));
        return "gerente_pagos";
    }

    @GetMapping("/servicios")
    public String servicios(HttpSession sesion, Model model) {
        Barberia barberia = barberiaEnSesion(sesion);
        model.addAttribute("barberia", barberia);
        model.addAttribute("servicios", servicioService.findTodosPorBarberiaId(barberia.getId()));
        return "gerente_servicios";
    }

    @GetMapping("/servicios/nuevo")
    public String nuevoServicio(HttpSession sesion, Model model) {
        Servicio servicio = new Servicio();
        servicio.setBarberia(barberiaActivaEnSesion(sesion));
        model.addAttribute("servicio", servicio);
        return "gerente_servicio_form";
    }

    @GetMapping("/servicios/editar/{id}")
    public String editarServicio(@PathVariable Integer id, HttpSession sesion, Model model) {
        barberiaActivaEnSesion(sesion);
        model.addAttribute("servicio", servicioDeMiBarberia(id, sesion));
        return "gerente_servicio_form";
    }

    @PostMapping("/servicios/guardar")
    public String guardarServicio(@Valid @ModelAttribute("servicio") Servicio servicio,
                                  BindingResult result, HttpSession sesion) {
        Barberia barberia = barberiaActivaEnSesion(sesion);
        if (servicio.getId() != null) {
            servicioDeMiBarberia(servicio.getId(), sesion);
        }
        servicio.setBarberia(barberia);
        if (result.hasFieldErrors("nombre") || result.hasFieldErrors("precio")) {
            return "gerente_servicio_form";
        }
        servicioService.save(servicio);
        return "redirect:/gerente/servicios";
    }

    @GetMapping("/servicios/desactivar/{id}")
    public String desactivarServicio(@PathVariable Integer id, HttpSession sesion) {
        barberiaActivaEnSesion(sesion);
        servicioDeMiBarberia(id, sesion);
        servicioService.desactivar(id);
        return "redirect:/gerente/servicios";
    }

    @GetMapping("/servicios/activar/{id}")
    public String activarServicio(@PathVariable Integer id, HttpSession sesion) {
        barberiaActivaEnSesion(sesion);
        servicioDeMiBarberia(id, sesion);
        servicioService.activar(id);
        return "redirect:/gerente/servicios";
    }

    @GetMapping("/espacios")
    public String espacios(HttpSession sesion, Model model) {
        Barberia barberia = barberiaEnSesion(sesion);
        model.addAttribute("barberia", barberia);
        model.addAttribute("espacios", espacioService.obtenerTodosPorBarberia(barberia.getId()));
        return "gerente_espacios";
    }

    @GetMapping("/espacios/nuevo")
    public String nuevoEspacio(HttpSession sesion, Model model) {
        Espacio espacio = new Espacio();
        espacio.setBarberia(barberiaActivaEnSesion(sesion));
        model.addAttribute("espacio", espacio);
        return "gerente_espacio_form";
    }

    @GetMapping("/espacios/editar/{id}")
    public String editarEspacio(@PathVariable Long id, HttpSession sesion, Model model) {
        barberiaActivaEnSesion(sesion);
        model.addAttribute("espacio", espacioDeMiBarberia(id, sesion));
        return "gerente_espacio_form";
    }

    @PostMapping("/espacios/guardar")
    public String guardarEspacio(@Valid @ModelAttribute("espacio") Espacio espacio,
                                 BindingResult result, HttpSession sesion) {
        Barberia barberia = barberiaActivaEnSesion(sesion);
        if (espacio.getId() != null) {
            espacioDeMiBarberia(espacio.getId(), sesion);
        }
        espacio.setBarberia(barberia);
        if (result.hasFieldErrors("nombre") || result.hasFieldErrors("capacidad")) {
            return "gerente_espacio_form";
        }
        espacioService.guardar(espacio);
        return "redirect:/gerente/espacios";
    }

    @GetMapping("/espacios/desactivar/{id}")
    public String desactivarEspacio(@PathVariable Long id, HttpSession sesion) {
        barberiaActivaEnSesion(sesion);
        espacioDeMiBarberia(id, sesion);
        espacioService.desactivar(id);
        return "redirect:/gerente/espacios";
    }

    @GetMapping("/espacios/activar/{id}")
    public String activarEspacio(@PathVariable Long id, HttpSession sesion) {
        barberiaActivaEnSesion(sesion);
        espacioDeMiBarberia(id, sesion);
        espacioService.activar(id);
        return "redirect:/gerente/espacios";
    }

    @GetMapping("/barberos")
    public String barberos(HttpSession sesion, Model model) {
        Barberia barberia = barberiaEnSesion(sesion);
        model.addAttribute("barberia", barberia);
        model.addAttribute("barberos", usuarioService.buscarTodosLosBarberosDeBarberia(barberia.getId()));
        return "gerente_barberos";
    }

    @GetMapping("/barberos/nuevo")
    public String nuevoBarbero(HttpSession sesion, Model model) {
        Usuario barbero = new Usuario();
        barbero.setRol(Rol.BARBERO);
        barbero.setBarberia(barberiaActivaEnSesion(sesion));
        model.addAttribute("barbero", barbero);
        return "gerente_barbero_form";
    }

    @GetMapping("/barberos/editar/{id}")
    public String editarBarbero(@PathVariable Long id, HttpSession sesion, Model model) {
        barberiaActivaEnSesion(sesion);
        model.addAttribute("barbero", barberoDeMiBarberia(id, sesion));
        return "gerente_barbero_form";
    }

    @PostMapping("/barberos/guardar")
    public String guardarBarbero(@Valid @ModelAttribute("barbero") Usuario barbero,
                                 BindingResult result, HttpSession sesion) {
        Barberia barberia = barberiaActivaEnSesion(sesion);
        if (barbero.getId() != null) {
            barberoDeMiBarberia(barbero.getId(), sesion);
        }
        barbero.setRol(Rol.BARBERO);
        barbero.setBarberia(barberia);
        if (result.hasErrors()) {
            return "gerente_barbero_form";
        }
        usuarioService.guardar(barbero);
        return "redirect:/gerente/barberos";
    }

    @GetMapping("/barberos/desactivar/{id}")
    public String desactivarBarbero(@PathVariable Long id, HttpSession sesion) {
        barberiaActivaEnSesion(sesion);
        barberoDeMiBarberia(id, sesion);
        usuarioService.desactivar(id);
        return "redirect:/gerente/barberos";
    }

    @GetMapping("/barberos/activar/{id}")
    public String activarBarbero(@PathVariable Long id, HttpSession sesion) {
        barberiaActivaEnSesion(sesion);
        barberoDeMiBarberia(id, sesion);
        usuarioService.activar(id);
        return "redirect:/gerente/barberos";
    }

    private Usuario gerente(HttpSession sesion) {
        return (Usuario) sesion.getAttribute("usuario");
    }

    private Barberia barberiaEnSesion(HttpSession sesion) {
        return accesoGerente.barberia(gerente(sesion));
    }

    private Barberia barberiaActivaEnSesion(HttpSession sesion) {
        return accesoGerente.barberiaActiva(gerente(sesion));
    }

    private Servicio servicioDeMiBarberia(Integer id, HttpSession sesion) {
        return accesoGerente.servicio(id, gerente(sesion));
    }

    private Espacio espacioDeMiBarberia(Long id, HttpSession sesion) {
        return accesoGerente.espacio(id, gerente(sesion));
    }

    private Usuario barberoDeMiBarberia(Long id, HttpSession sesion) {
        return accesoGerente.barbero(id, gerente(sesion));
    }

    private Map<Long, Pago> pagosPorReserva(Long barberiaId) {
        List<Pago> pagos = pagoService.findByBarberiaId(barberiaId);
        return pagos.stream().collect(Collectors.toMap(pago -> pago.getReserva().getId(), pago -> pago));
    }
}
