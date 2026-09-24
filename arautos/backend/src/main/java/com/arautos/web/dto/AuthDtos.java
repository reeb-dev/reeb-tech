package com.arautos.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public final class AuthDtos {
  private AuthDtos() {}

  public record LoginRequest(
      @NotBlank @Email String email,
      @NotBlank String password) {}

  public record RegisterRequest(
      @NotBlank @Email String email,
      @NotBlank @Size(min = 6) String password,
      @NotBlank String dealerName,
      String slug,
      @NotBlank String province,
      @NotBlank String city,
      String address,
      @NotBlank String whatsapp,
      String description) {}

  public record AuthResponse(
      String token,
      UUID userId,
      String email,
      String role,
      UUID tenantId,
      String tenantSlug,
      String tenantName,
      String subscriptionStatus,
      String moderationStatus,
      String message) {}
}
