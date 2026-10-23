package com.example.demo.service;

import com.example.demo.entities.Servicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ServicioService {
    Servicio findById(Integer id);
    List<Servicio> findAll();
    List<Servicio> findByBarberiaId(Long barberiaId);
    List<Servicio> findTodosPorBarberiaId(Long barberiaId);
    Servicio save(Servicio servicio);
    void desactivar(Integer id);
    void activar(Integer id);

    Page<Servicio> listarPaginado(String nombre, Double precioMin, Double precioMax, Pageable pageable);
    List<Servicio> listarPorBarberia(Long barberiaId);
    void eliminar(Integer id);
}
