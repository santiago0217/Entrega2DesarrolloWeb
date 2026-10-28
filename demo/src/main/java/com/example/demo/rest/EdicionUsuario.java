package com.example.demo.rest;

import org.springframework.stereotype.Component;

import com.example.demo.entities.Usuario;
import com.example.demo.exception.CorreoDuplicadoException;
import com.example.demo.service.UsuarioService;

// Pasa los datos que llegan en el JSON a la entidad que se va a guardar.
// La API nunca envía la contraseña, así que al editar se conserva si llega vacía.
@Component
public class EdicionUsuario {

    private final UsuarioService usuarioService;
    private final Validacion validacion;

    public EdicionUsuario(UsuarioService usuarioService, Validacion validacion) {
        this.usuarioService = usuarioService;
        this.validacion = validacion;
    }

    public Usuario aplicar(Usuario destino, Usuario datos) {
        if (datos.getCorreo() != null && !datos.getCorreo().equals(destino.getCorreo())
                && usuarioService.existeCorreo(datos.getCorreo())) {
            throw new CorreoDuplicadoException("Ya existe una cuenta registrada con ese correo.");
        }
        destino.setNombre(datos.getNombre());
        destino.setCorreo(datos.getCorreo());
        destino.setTelefono(datos.getTelefono());
        destino.setRol(datos.getRol());
        destino.setBarberia(datos.getBarberia());
        if (datos.getActivo() != null) {
            destino.setActivo(datos.getActivo());
        }
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            destino.setPassword(datos.getPassword());
        }
        validacion.validar(destino);
        return destino;
    }
}
