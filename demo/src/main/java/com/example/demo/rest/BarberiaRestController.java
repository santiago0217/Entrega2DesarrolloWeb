package com.example.demo.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Barberia;
import com.example.demo.service.BarberiaService;

import jakarta.validation.Valid;

// Entidad B: Barbería
@RestController
@RequestMapping("/api/barberias")
public class BarberiaRestController {

    private final BarberiaService barberiaService;

    public BarberiaRestController(BarberiaService barberiaService) {
        this.barberiaService = barberiaService;
    }

    @GetMapping
    public List<Barberia> listar() {
        return barberiaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Barberia> obtener(@PathVariable Long id) {
        Barberia barberia = barberiaService.obtenerPorId(id);
        if (barberia == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(barberia);
    }

    @PostMapping
    public ResponseEntity<Barberia> crear(@Valid @RequestBody Barberia barberia) {
        barberia.setId(null);
        if (barberia.getActivo() == null) {
            barberia.setActivo(true);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(barberiaService.guardar(barberia));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Barberia> actualizar(@PathVariable Long id, @Valid @RequestBody Barberia datos) {
        Barberia barberia = barberiaService.obtenerPorId(id);
        if (barberia == null) {
            return ResponseEntity.notFound().build();
        }
        barberia.setNombre(datos.getNombre());
        barberia.setDireccion(datos.getDireccion());
        barberia.setTelefono(datos.getTelefono());
        barberia.setHorario(datos.getHorario());
        if (datos.getActivo() != null) {
            barberia.setActivo(datos.getActivo());
        }
        return ResponseEntity.ok(barberiaService.guardar(barberia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (barberiaService.obtenerPorId(id) == null) {
            return ResponseEntity.notFound().build();
        }
        barberiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
