package com.example.demo.service;

import com.example.demo.entities.Barberia;
import com.example.demo.repository.BarberiaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BarberiaServiceImpl implements BarberiaService {

    private final BarberiaRepository barberiaRepository;

    public BarberiaServiceImpl(BarberiaRepository barberiaRepository) {
        this.barberiaRepository = barberiaRepository;
    }

    @Override
    public List<Barberia> obtenerTodas() {
        return barberiaRepository.findAll();
    }

    @Override
    public List<Barberia> obtenerActivas() {
        return barberiaRepository.findByActivoTrue();
    }

    @Override
    public Barberia obtenerPorId(Long id) {
        return barberiaRepository.findById(id).orElse(null);
    }

    @Override
    public Barberia guardar(Barberia barberia) {
        return barberiaRepository.save(barberia);
    }

    @Override
    public void desactivar(Long id) {
        Barberia barberia = obtenerPorId(id);
        if (barberia != null) {
            barberia.setActivo(false);
            barberiaRepository.save(barberia);
        }
    }

    @Override
    public void activar(Long id) {
        Barberia barberia = obtenerPorId(id);
        if (barberia != null) {
            barberia.setActivo(true);
            barberiaRepository.save(barberia);
        }
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        barberiaRepository.deleteById(id);
        barberiaRepository.flush();
    }
}
