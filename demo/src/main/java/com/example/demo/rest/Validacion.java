package com.example.demo.rest;

import java.util.Set;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;

@Component
public class Validacion {

    private final Validator validator;

    public Validacion(Validator validator) {
        this.validator = validator;
    }

    public void validar(Object objeto) {
        Set<ConstraintViolation<Object>> errores = validator.validate(objeto);
        if (!errores.isEmpty()) {
            throw new ConstraintViolationException(errores);
        }
    }
}
