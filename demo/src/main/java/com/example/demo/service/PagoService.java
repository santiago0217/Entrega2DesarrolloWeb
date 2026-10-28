package com.example.demo.service;

import com.example.demo.dto.ResumenBarberia;
import com.example.demo.entities.Pago;
import java.util.Collection;
import java.util.List;

public interface PagoService {
    Pago findById(Integer id);
    Pago findByReservaId(Long reservaId);
    Collection<Pago> findAll();
    List<Pago> findByBarberiaId(Long barberiaId);
    List<ResumenBarberia> buscarBarberiasConIngresosMayoresA(Double minimo);
    Double totalRecaudado(Long barberiaId);
    Pago save(Pago pago);
    void deleteById(Integer id);
}
