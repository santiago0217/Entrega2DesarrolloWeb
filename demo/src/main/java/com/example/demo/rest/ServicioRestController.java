package com.example.demo.rest;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Barberia;
import com.example.demo.entities.Servicio;
import com.example.demo.service.BarberiaService;
import com.example.demo.service.ServicioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/servicios")
public class ServicioRestController {

    private final ServicioService servicioService;
    private final BarberiaService barberiaService;

    public ServicioRestController(ServicioService servicioService, BarberiaService barberiaService) {
        this.servicioService = servicioService;
        this.barberiaService = barberiaService;
    }

    @GetMapping
    public Page<Servicio> listar(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "5") int size,
                                 @RequestParam(required = false) String nombre,
                                 @RequestParam(required = false) Double min,
                                 @RequestParam(required = false) Double max) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        return servicioService.listarPaginado(nombre, min, max, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> obtener(@PathVariable Integer id) {
        Servicio servicio = servicioService.findById(id);
        if (servicio == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(servicio);
    }

    @GetMapping("/barberia/{barberiaId}")
    public List<Servicio> listarPorBarberia(@PathVariable Long barberiaId) {
        return servicioService.listarPorBarberia(barberiaId);
    }

    @PostMapping
    public ResponseEntity<Servicio> crear(@Valid @RequestBody Servicio servicio) {
        Barberia barberia = buscarBarberia(servicio);
        if (barberia == null) {
            return ResponseEntity.badRequest().build();
        }
        servicio.setId(null);
        servicio.setBarberia(barberia);
        if (servicio.getActivo() == null) {
            servicio.setActivo(true);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioService.save(servicio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicio> actualizar(@PathVariable Integer id, @Valid @RequestBody Servicio datos) {
        Servicio servicio = servicioService.findById(id);
        if (servicio == null) {
            return ResponseEntity.notFound().build();
        }
        Barberia barberia = buscarBarberia(datos);
        if (barberia == null) {
            return ResponseEntity.badRequest().build();
        }
        servicio.setNombre(datos.getNombre());
        servicio.setDescripcion(datos.getDescripcion());
        servicio.setPrecio(datos.getPrecio());
        servicio.setBarberia(barberia);
        if (datos.getActivo() != null) {
            servicio.setActivo(datos.getActivo());
        }
        return ResponseEntity.ok(servicioService.save(servicio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (servicioService.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        servicioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private Barberia buscarBarberia(Servicio servicio) {
        if (servicio.getBarberia() == null || servicio.getBarberia().getId() == null) {
            return null;
        }
        return barberiaService.obtenerPorId(servicio.getBarberia().getId());
    }
}
