package com.arautos.service;

import com.arautos.domain.Tenant;
import com.arautos.domain.Vehicle;
import com.arautos.web.dto.VehicleDtos;
import java.util.List;

public final class VehicleMapper {
  private VehicleMapper() {}

  public static VehicleDtos.VehiclePublicDto toPublic(Vehicle v) {
    Tenant t = v.getTenant();
    return new VehicleDtos.VehiclePublicDto(
        v.getId(),
        v.getBrand(),
        v.getModel(),
        v.getVersion(),
        v.getYear(),
        v.getKm(),
        v.getType(),
        v.getPrice(),
        v.getCurrency(),
        List.copyOf(v.getPhotos()),
        v.getProvince(),
        v.getCity(),
        v.getFuel(),
        v.getTransmission(),
        v.getColor(),
        v.getDescription(),
        t.getName(),
        t.getSlug(),
        t.getWhatsapp(),
        v.getCreatedAt());
  }

  public static VehicleDtos.VehiclePanelDto toPanel(Vehicle v) {
    return new VehicleDtos.VehiclePanelDto(
        v.getId(),
        v.getBrand(),
        v.getModel(),
        v.getVersion(),
        v.getYear(),
        v.getKm(),
        v.getType(),
        v.getPrice(),
        v.getCurrency(),
        List.copyOf(v.getPhotos()),
        v.getProvince(),
        v.getCity(),
        v.getFuel(),
        v.getTransmission(),
        v.getColor(),
        v.getDescription(),
        v.getStatus(),
        v.getViews(),
        v.getWaClicks(),
        v.getCreatedAt(),
        v.getUpdatedAt());
  }

  public static void apply(Vehicle v, VehicleDtos.VehicleRequest req) {
    v.setBrand(req.brand());
    v.setModel(req.model());
    v.setVersion(req.version());
    v.setYear(req.year());
    v.setKm(req.km());
    v.setType(req.type());
    v.setPrice(req.price());
    v.setCurrency(req.currency());
    v.setPhotos(req.photos() != null ? req.photos() : List.of());
    v.setProvince(req.province());
    v.setCity(req.city());
    v.setFuel(req.fuel());
    v.setTransmission(req.transmission());
    v.setColor(req.color());
    v.setDescription(req.description());
    v.setStatus(req.status());
  }
}
