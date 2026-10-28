package com.example.demo.rest;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.Credenciales;
import com.example.demo.entities.Rol;
import com.example.demo.entities.Usuario;
import com.example.demo.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

// Login de Angular. Guarda el usuario en la misma HttpSession que usa AuthController (Thymeleaf),
// así los interceptores aplican las mismas reglas por rol a las dos aplicaciones.
@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    private final UsuarioService usuarioService;
    private final EdicionUsuario edicionUsuario;

    public AuthRestController(UsuarioService usuarioService, EdicionUsuario edicionUsuario) {
        this.usuarioService = usuarioService;
        this.edicionUsuario = edicionUsuario;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Credenciales credenciales, HttpSession sesion) {
        Usuario usuario = usuarioService.autenticar(credenciales.correo(), credenciales.password());
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Correo o contraseña incorrectos."));
        }
        sesion.setAttribute("usuario", usuario);
        return ResponseEntity.ok(usuario);
    }

    // Angular la llama al recargar la página para saber si la sesión sigue abierta
    @GetMapping("/sesion")
    public ResponseEntity<Usuario> sesion(HttpSession sesion) {
        Usuario usuario = (Usuario) sesion.getAttribute("usuario");
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(usuario);
    }

    // Registro público: siempre crea un CLIENTE, como en /registro
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registro(@RequestBody Usuario datos) {
        Usuario usuario = new Usuario();
        datos.setRol(Rol.CLIENTE);
        datos.setBarberia(null);
        datos.setActivo(true);
        edicionUsuario.aplicar(usuario, datos);
        usuarioService.registrarCliente(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession sesion) {
        sesion.invalidate();
        return ResponseEntity.noContent().build();
    }
}
