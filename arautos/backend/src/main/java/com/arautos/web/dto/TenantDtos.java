package com.arautos.web.dto;

import com.arautos.domain.enums.ModerationStatus;
import com.arautos.domain.enums.SubscriptionStatus;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class TenantDtos {
  private TenantDtos() {}

  public record ProfileUpdateRequest(
      String name,
      String logoUrl,
      String province,
      String city,
      String address,
      String whatsapp,
      String email,
      String description) {}

  public record TenantPublicDto(
      UUID id,
      String name,
      String slug,
      String logoUrl,
      String province,
      String city,
      String address,
      String whatsapp,
      String email,
      String description,
      List<VehicleDtos.VehiclePublicDto> vehicles) {}

  public record TenantPanelDto(
      UUID id,
      String name,
      String slug,
      String logoUrl,
      String province,
      String city,
      String address,
      String whatsapp,
      String email,
      String description,
      SubscriptionStatus subscriptionStatus,
      Instant trialEndsAt,
      String planId,
      String planName,
      String planPriceUsd,
      String planPriceArs,
      ModerationStatus moderationStatus,
      boolean readOnly) {}

  public record StatsDto(
      long activeListings,
      long totalViews,
      long totalWaClicks,
      SubscriptionStatus subscriptionStatus,
      Instant trialEndsAt,
      boolean readOnly) {}
}
