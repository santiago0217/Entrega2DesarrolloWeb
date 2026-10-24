package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

// Solo para los controladores Thymeleaf; la API REST usa RestExceptionHandler.
@ControllerAdvice(basePackages = "com.example.demo.controller")
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public String manejarRecursoNoEncontrado(RecursoNoEncontradoException ex, Model model) {
        model.addAttribute("mensaje", ex.getMessage());
        return "error";
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(EspacioNoDisponibleException.class)
    public String manejarEspacioNoDisponible(EspacioNoDisponibleException ex, Model model) {
        model.addAttribute("mensaje", ex.getMessage());
        return "error";
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(PagoDuplicadoException.class)
    public String manejarPagoDuplicado(PagoDuplicadoException ex, Model model) {
        model.addAttribute("mensaje", ex.getMessage());
        return "error";
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(BarberiaInactivaException.class)
    public String manejarBarberiaInactiva(BarberiaInactivaException ex, Model model) {
        model.addAttribute("mensaje", ex.getMessage());
        return "error";
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public String manejarErrorGeneral(Exception ex, Model model) {
        model.addAttribute("mensaje", "Ocurrió un error inesperado. Por favor intenta nuevamente.");
        return "error";
    }
}
