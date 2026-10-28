package com.example.demo.service;

import com.example.demo.dto.ResumenBarberia;
import com.example.demo.entities.Pago;
import com.example.demo.exception.PagoDuplicadoException;
import com.example.demo.repository.PagoRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class PagoServiceImpl implements PagoService {

    private final PagoRepository pagoRepository;

    public PagoServiceImpl(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    @Override
    public Pago findById(Integer id) {
        return pagoRepository.findById(id).orElse(null);
    }

    @Override
    public Pago findByReservaId(Long reservaId) {
        return pagoRepository.findByReservaId(reservaId).orElse(null);
    }

    @Override
    public Collection<Pago> findAll() {
        return pagoRepository.findAll();
    }

    @Override
    public List<Pago> findByBarberiaId(Long barberiaId) {
        return pagoRepository.findByReservaServicioBarberiaId(barberiaId);
    }

    @Override
    public List<ResumenBarberia> buscarBarberiasConIngresosMayoresA(Double minimo) {
        return pagoRepository.buscarBarberiasConIngresosMayoresA(minimo);
    }

    @Override
    public Double totalRecaudado(Long barberiaId) {
        return findByBarberiaId(barberiaId).stream()
                .filter(pago -> "COMPLETADO".equals(pago.getEstado()))
                .mapToDouble(Pago::getMonto)
                .sum();
    }

    @Override
    public Pago save(Pago pago) {
        if (reservaYaTienePago(pago)) {
            throw new PagoDuplicadoException("La reserva seleccionada ya tiene un pago registrado.");
        }
        return pagoRepository.save(pago);
    }

    @Override
    public void deleteById(Integer id) {
        pagoRepository.deleteById(id);
    }

    private boolean reservaYaTienePago(Pago pago) {
        return pagoRepository.findByReservaId(pago.getReserva().getId())
                .filter(existente -> !existente.getId().equals(pago.getId()))
                .isPresent();
    }
}
