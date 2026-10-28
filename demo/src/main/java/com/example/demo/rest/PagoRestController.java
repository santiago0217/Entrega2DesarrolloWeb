package com.example.demo.rest;

import java.util.Collection;

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

import com.example.demo.entities.Pago;
import com.example.demo.exception.RecursoNoEncontradoException;
import com.example.demo.service.PagoService;
import com.example.demo.service.ReservaService;

// Equivalente REST de PagoController
@RestController
@RequestMapping("/api/admin/pagos")
public class PagoRestController {

    private final PagoService pagoService;
    private final ReservaService reservaService;
    private final Validacion validacion;

    public PagoRestController(PagoService pagoService, ReservaService reservaService, Validacion validacion) {
        this.pagoService = pagoService;
        this.reservaService = reservaService;
        this.validacion = validacion;
    }

    @GetMapping
    public Collection<Pago> listar() {
        return pagoService.findAll();
    }

    @GetMapping("/{id}")
    public Pago obtener(@PathVariable Integer id) {
        return buscar(id);
    }

    @PostMapping
    public ResponseEntity<Pago> crear(@RequestBody Pago datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(guardar(new Pago(), datos));
    }

    @PutMapping("/{id}")
    public Pago actualizar(@PathVariable Integer id, @RequestBody Pago datos) {
        return guardar(buscar(id), datos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        buscar(id);
        pagoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Pago guardar(Pago pago, Pago datos) {
        pago.setReserva(datos.getReserva() == null || datos.getReserva().getId() == null
                ? null : reservaService.findById(datos.getReserva().getId()));
        pago.setMonto(datos.getMonto());
        pago.setMetodoPago(datos.getMetodoPago());
        pago.setEstado(datos.getEstado());
        validacion.validar(pago);
        return pagoService.save(pago);
    }

    private Pago buscar(Integer id) {
        Pago pago = pagoService.findById(id);
        if (pago == null) {
            throw new RecursoNoEncontradoException("No existe un pago con id " + id);
        }
        return pago;
    }
}
