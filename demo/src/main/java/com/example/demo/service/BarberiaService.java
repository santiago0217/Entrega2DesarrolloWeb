package com.example.demo.service;

import com.example.demo.entities.Barberia;
import java.util.List;

public interface BarberiaService {
    List<Barberia> obtenerTodas();
    List<Barberia> obtenerActivas();
    Barberia obtenerPorId(Long id);
    Barberia guardar(Barberia barberia);
    void desactivar(Long id);
    void activar(Long id);

    void eliminar(Long id);
}
