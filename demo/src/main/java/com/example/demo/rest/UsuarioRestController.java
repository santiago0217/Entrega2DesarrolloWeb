package com.example.demo.rest;

import java.util.List;
import java.util.Map;

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

import com.example.demo.dto.ResumenRol;
import com.example.demo.entities.Barberia;
import com.example.demo.entities.Rol;
import com.example.demo.entities.Usuario;
import com.example.demo.exception.RecursoNoEncontradoException;
import com.example.demo.service.BarberiaService;
import com.example.demo.service.UsuarioService;

// Equivalente REST de UsuarioController
@RestController
@RequestMapping("/api/admin/usuarios")
public class UsuarioRestController {

    private final UsuarioService usuarioService;
    private final BarberiaService barberiaService;
    private final EdicionUsuario edicionUsuario;

    public UsuarioRestController(UsuarioService usuarioService, BarberiaService barberiaService,
                                 EdicionUsuario edicionUsuario) {
        this.usuarioService = usuarioService;
        this.barberiaService = barberiaService;
        this.edicionUsuario = edicionUsuario;
    }

    // GET /api/admin/usuarios?rol=BARBERO
    @GetMapping
    public List<Usuario> listar(@RequestParam(required = false) Rol rol) {
        return rol != null ? usuarioService.buscarTodosPorRol(rol) : usuarioService.buscarTodos();
    }

    @GetMapping("/resumen-roles")
    public List<ResumenRol> resumenRoles() {
        return usuarioService.contarUsuariosPorRol();
    }

    @GetMapping("/{id}")
    public Usuario obtener(@PathVariable Long id) {
        return buscar(id);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Usuario datos) {
        return guardar(new Usuario(), datos, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Usuario datos) {
        return guardar(buscar(id), datos, HttpStatus.OK);
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        buscar(id);
        usuarioService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        buscar(id);
        usuarioService.activar(id);
        return ResponseEntity.noContent().build();
    }

    // Misma regla que UsuarioController: barberos y gerentes necesitan barbería; los demás no la tienen
    private ResponseEntity<?> guardar(Usuario usuario, Usuario datos, HttpStatus status) {
        if (datos.getRol() == Rol.BARBERO || datos.getRol() == Rol.GERENTE) {
            Barberia barberia = datos.getBarberia() == null || datos.getBarberia().getId() == null
                    ? null : barberiaService.obtenerPorId(datos.getBarberia().getId());
            if (barberia == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("barberia", "Debes asignar una barbería a los barberos y gerentes"));
            }
            datos.setBarberia(barberia);
        } else {
            datos.setBarberia(null);
        }
        edicionUsuario.aplicar(usuario, datos);
        usuarioService.guardar(usuario);
        return ResponseEntity.status(status).body(usuario);
    }

    private Usuario buscar(Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        if (usuario == null) {
            throw new RecursoNoEncontradoException("No existe un usuario con id " + id);
        }
        return usuario;
    }
}
