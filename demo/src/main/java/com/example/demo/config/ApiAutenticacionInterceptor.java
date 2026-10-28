package com.example.demo.config;

import com.example.demo.entities.Usuario;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.servlet.HandlerInterceptor;

// Igual que AutenticacionInterceptor, pero para la API: responde 401/403 en JSON en lugar de redirigir.
@Component
public class ApiAutenticacionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        // La petición previa de CORS (OPTIONS) no lleva la cookie de sesión
        if (CorsUtils.isPreFlightRequest(request)) {
            return true;
        }

        HttpSession sesion = request.getSession(false);
        Usuario usuario = sesion == null ? null : (Usuario) sesion.getAttribute("usuario");

        if (usuario == null) {
            responder(response, HttpStatus.UNAUTHORIZED, "Debes iniciar sesión.");
            return false;
        }

        // /api/gerente/... se valida con la misma regla que /gerente/...
        String ruta = request.getRequestURI().substring("/api".length());
        if (!AutenticacionInterceptor.tieneAcceso(usuario.getRol(), ruta)) {
            responder(response, HttpStatus.FORBIDDEN, "No tienes permisos para acceder a esa sección.");
            return false;
        }

        return true;
    }

    private void responder(HttpServletResponse response, HttpStatus status, String mensaje) throws Exception {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"mensaje\":\"" + mensaje + "\"}");
    }
}
