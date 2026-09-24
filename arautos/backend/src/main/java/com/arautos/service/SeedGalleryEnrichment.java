package com.arautos.service;

import com.arautos.domain.Vehicle;
import com.arautos.repo.VehicleRepository;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Completa galerías de demo cuando un aviso quedó con una sola foto (seed viejo).
 * Idempotente: solo toca vehículos con menos de 2 fotos.
 */
@Component
@Order(100)
public class SeedGalleryEnrichment implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(SeedGalleryEnrichment.class);
  private static final List<String> POOL = List.of(
      "/assets/cars/toyota-corolla.jpg",
      "/assets/cars/jeep-compass.jpg",
      "/assets/cars/ford-ranger.jpg",
      "/assets/cars/fiat-cronos.jpg",
      "/assets/cars/chevrolet-tracker.jpg",
      "/assets/cars/peugeot-208.jpg");

  private final VehicleRepository vehicles;

  public SeedGalleryEnrichment(VehicleRepository vehicles) {
    this.vehicles = vehicles;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    int updated = 0;
    for (Vehicle v : vehicles.findAll()) {
      List<String> photos = v.getPhotos() == null ? new ArrayList<>() : new ArrayList<>(v.getPhotos());
      if (photos.size() >= 2) {
        continue;
      }
      String primary = photos.isEmpty() ? POOL.get(0) : photos.get(0);
      List<String> next = new ArrayList<>();
      next.add(primary);
      for (String candidate : POOL) {
        if (!next.contains(candidate)) {
          next.add(candidate);
        }
        if (next.size() >= 3) {
          break;
        }
      }
      v.setPhotos(next);
      vehicles.save(v);
      updated++;
    }
    if (updated > 0) {
      log.info("Galería demo enriquecida en {} avisos", updated);
    }
  }
}
