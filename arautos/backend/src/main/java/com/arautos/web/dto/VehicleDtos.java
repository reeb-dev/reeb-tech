package com.arautos.web.dto;

import com.arautos.domain.enums.CurrencyCode;
import com.arautos.domain.enums.VehicleStatus;
import com.arautos.domain.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class VehicleDtos {
  private VehicleDtos() {}

  public record VehicleRequest(
      @NotBlank String brand,
      @NotBlank String model,
      String version,
      @NotNull Integer year,
      @NotNull @PositiveOrZero Integer km,
      @NotNull VehicleType type,
      @NotNull BigDecimal price,
      @NotNull CurrencyCode currency,
      List<String> photos,
      @NotBlank String province,
      @NotBlank String city,
      String fuel,
      String transmission,
      String color,
      String description,
      @NotNull VehicleStatus status) {}

  public record VehiclePublicDto(
      UUID id,
      String brand,
      String model,
      String version,
      Integer year,
      Integer km,
      VehicleType type,
      BigDecimal price,
      CurrencyCode currency,
      List<String> photos,
      String province,
      String city,
      String fuel,
      String transmission,
      String color,
      String description,
      String dealerName,
      String dealerSlug,
      String dealerWhatsapp,
      Instant createdAt) {}

  public record VehiclePanelDto(
      UUID id,
      String brand,
      String model,
      String version,
      Integer year,
      Integer km,
      VehicleType type,
      BigDecimal price,
      CurrencyCode currency,
      List<String> photos,
      String province,
      String city,
      String fuel,
      String transmission,
      String color,
      String description,
      VehicleStatus status,
      long views,
      long waClicks,
      Instant createdAt,
      Instant updatedAt) {}
}
