package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.entities.Barberia;
import com.example.demo.entities.Espacio;
import com.example.demo.entities.Rol;
import com.example.demo.entities.Servicio;
import com.example.demo.entities.Usuario;
import com.example.demo.exception.BarberiaInactivaException;
import com.example.demo.exception.RecursoNoEncontradoException;

// Reglas del gerente: solo trabaja sobre su barbería y solo puede modificarla si está activa.
@Service
public class AccesoGerente {

    private final BarberiaService barberiaService;
    private final ServicioService servicioService;
    private final EspacioService espacioService;
    private final UsuarioService usuarioService;

    public AccesoGerente(BarberiaService barberiaService, ServicioService servicioService,
                         EspacioService espacioService, UsuarioService usuarioService) {
        this.barberiaService = barberiaService;
        this.servicioService = servicioService;
        this.espacioService = espacioService;
        this.usuarioService = usuarioService;
    }

    public Barberia barberia(Usuario gerente) {
        if (gerente.getBarberia() == null) {
            throw new RecursoNoEncontradoException("Tu cuenta no tiene una barbería asignada.");
        }
        Barberia barberia = barberiaService.obtenerPorId(gerente.getBarberia().getId());
        if (barberia == null) {
            throw new RecursoNoEncontradoException("Tu barbería ya no existe en el sistema.");
        }
        return barberia;
    }

    public Barberia barberiaActiva(Usuario gerente) {
        Barberia barberia = barberia(gerente);
        if (!barberia.getActivo()) {
            throw new BarberiaInactivaException(
                    "Tu barbería está desactivada, por lo que no puedes hacer cambios. "
                            + "Contacta al administrador del sistema.");
        }
        return barberia;
    }

    public Servicio servicio(Integer id, Usuario gerente) {
        Servicio servicio = servicioService.findById(id);
        if (servicio == null || !servicio.getBarberia().getId().equals(barberia(gerente).getId())) {
            throw new RecursoNoEncontradoException("No existe un servicio con id " + id + " en tu barbería.");
        }
        return servicio;
    }

    public Espacio espacio(Long id, Usuario gerente) {
        Espacio espacio = espacioService.obtenerPorId(id);
        if (espacio == null || !espacio.getBarberia().getId().equals(barberia(gerente).getId())) {
            throw new RecursoNoEncontradoException("No existe un espacio con id " + id + " en tu barbería.");
        }
        return espacio;
    }

    public Usuario barbero(Long id, Usuario gerente) {
        Usuario barbero = usuarioService.buscarPorId(id);
        if (barbero == null || barbero.getRol() != Rol.BARBERO || barbero.getBarberia() == null
                || !barbero.getBarberia().getId().equals(barberia(gerente).getId())) {
            throw new RecursoNoEncontradoException("No existe un barbero con id " + id + " en tu barbería.");
        }
        return barbero;
    }
}
