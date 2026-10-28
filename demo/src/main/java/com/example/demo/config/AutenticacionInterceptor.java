package com.example.demo.config;

import com.example.demo.entities.Rol;
import com.example.demo.entities.Usuario;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AutenticacionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        HttpSession sesion = request.getSession(false);
        Usuario usuario = sesion == null ? null : (Usuario) sesion.getAttribute("usuario");

        if (usuario == null) {
            response.sendRedirect("/login");
            return false;
        }

        String ruta = request.getRequestURI();
        if (!tieneAcceso(usuario.getRol(), ruta)) {
            response.sendRedirect("/acceso-denegado");
            return false;
        }

        return true;
    }

    // También lo usa ApiAutenticacionInterceptor, así las dos aplicaciones aplican las mismas reglas
    static boolean tieneAcceso(Rol rol, String ruta) {
        if (ruta.startsWith("/admin")) {
            return rol == Rol.ADMINISTRADOR;
        }
        if (ruta.startsWith("/gerente")) {
            return rol == Rol.GERENTE;
        }
        if (ruta.startsWith("/barbero")) {
            return rol == Rol.BARBERO;
        }
        if (ruta.startsWith("/cliente")) {
            return rol == Rol.CLIENTE;
        }
        return true;
    }
}
