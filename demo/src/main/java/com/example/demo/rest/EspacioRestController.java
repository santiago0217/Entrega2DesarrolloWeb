package com.example.demo.rest;

import java.util.List;

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

import com.example.demo.entities.Espacio;
import com.example.demo.exception.RecursoNoEncontradoException;
import com.example.demo.service.BarberiaService;
import com.example.demo.service.EspacioService;

@RestController
@RequestMapping("/api/admin/espacios")
public class EspacioRestController {

    private final EspacioService espacioService;
    private final BarberiaService barberiaService;
    private final Validacion validacion;

    public EspacioRestController(EspacioService espacioService, BarberiaService barberiaService,
                                 Validacion validacion) {
        this.espacioService = espacioService;
        this.barberiaService = barberiaService;
        this.validacion = validacion;
    }

    @GetMapping
    public List<Espacio> listar(@RequestParam(required = false) Integer capacidadMinima) {
        return capacidadMinima != null
                ? espacioService.obtenerPorCapacidadMinima(capacidadMinima)
                : espacioService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Espacio obtener(@PathVariable Long id) {
        return buscar(id);
    }

    @PostMapping
    public ResponseEntity<Espacio> crear(@RequestBody Espacio datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(guardar(new Espacio(), datos));
    }

    @PutMapping("/{id}")
    public Espacio actualizar(@PathVariable Long id, @RequestBody Espacio datos) {
        return guardar(buscar(id), datos);
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        buscar(id);
        espacioService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        buscar(id);
        espacioService.activar(id);
        return ResponseEntity.noContent().build();
    }

    private Espacio guardar(Espacio espacio, Espacio datos) {
        espacio.setNombre(datos.getNombre());
        espacio.setCapacidad(datos.getCapacidad());
        espacio.setBarberia(datos.getBarberia() == null || datos.getBarberia().getId() == null
                ? null : barberiaService.obtenerPorId(datos.getBarberia().getId()));
        if (datos.getActivo() != null) {
            espacio.setActivo(datos.getActivo());
        }
        validacion.validar(espacio);
        return espacioService.guardar(espacio);
    }

    private Espacio buscar(Long id) {
        Espacio espacio = espacioService.obtenerPorId(id);
        if (espacio == null) {
            throw new RecursoNoEncontradoException("No existe un espacio con id " + id);
        }
        return espacio;
    }
}
