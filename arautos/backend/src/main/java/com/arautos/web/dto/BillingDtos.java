package com.arautos.web.dto;

import com.arautos.domain.enums.SubscriptionStatus;
import java.time.Instant;

public final class BillingDtos {
  private BillingDtos() {}

  public record BillingStatusDto(
      SubscriptionStatus subscriptionStatus,
      Instant trialEndsAt,
      String planId,
      String planName,
      String planPriceUsd,
      String planPriceArs,
      boolean mpConfigured,
      String mpPreferenceId,
      boolean readOnly,
      String message) {}

  public record CheckoutResponse(
      boolean configured,
      String preferenceId,
      String initPoint,
      String sandboxInitPoint,
      String message) {}
}
