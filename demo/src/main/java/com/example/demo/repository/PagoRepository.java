package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.dto.ResumenBarberia;
import com.example.demo.entities.Pago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {

    Optional<Pago> findByReservaId(Long reservaId);

    List<Pago> findByReservaServicioBarberiaId(Long barberiaId);

    @Query("SELECT new com.example.demo.dto.ResumenBarberia(p.reserva.servicio.barberia.nombre, SUM(p.monto)) "
            + "FROM Pago p "
            + "WHERE p.estado = 'COMPLETADO' "
            + "GROUP BY p.reserva.servicio.barberia.nombre "
            + "HAVING SUM(p.monto) > :minimo "
            + "ORDER BY SUM(p.monto) DESC")
    List<ResumenBarberia> buscarBarberiasConIngresosMayoresA(@Param("minimo") Double minimo);
}
