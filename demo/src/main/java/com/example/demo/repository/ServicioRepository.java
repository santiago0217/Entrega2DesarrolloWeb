package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.Servicio;

import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer> {

    List<Servicio> findByBarberiaIdAndActivoTrue(Long barberiaId);

    List<Servicio> findByBarberiaId(Long barberiaId);

    @Query("SELECT s FROM Servicio s WHERE LOWER(s.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    Page<Servicio> buscarPorNombre(@Param("nombre") String nombre, Pageable pageable);

    @Query("SELECT s FROM Servicio s WHERE s.precio BETWEEN :min AND :max")
    Page<Servicio> filtrarPorPrecio(@Param("min") Double min, @Param("max") Double max, Pageable pageable);

    @Query("SELECT s FROM Servicio s WHERE s.barberia.id = :barberiaId ORDER BY s.nombre")
    List<Servicio> listarPorBarberia(@Param("barberiaId") Long barberiaId);
}
