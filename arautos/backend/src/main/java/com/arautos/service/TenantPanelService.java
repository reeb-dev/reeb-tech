package com.arautos.service;

import com.arautos.config.ArautosProperties;
import com.arautos.domain.Tenant;
import com.arautos.domain.enums.VehicleStatus;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.VehicleRepository;
import com.arautos.security.UserPrincipal;
import com.arautos.web.dto.TenantDtos;
import com.arautos.web.error.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TenantPanelService {
  private final TenantRepository tenants;
  private final VehicleRepository vehicles;
  private final SubscriptionService subscriptions;
  private final ArautosProperties properties;

  public TenantPanelService(TenantRepository tenants, VehicleRepository vehicles,
                            SubscriptionService subscriptions, ArautosProperties properties) {
    this.tenants = tenants;
    this.vehicles = vehicles;
    this.subscriptions = subscriptions;
    this.properties = properties;
  }

  @Transactional(readOnly = true)
  public TenantDtos.TenantPanelDto profile(UserPrincipal principal) {
    Tenant t = require(principal);
    subscriptions.refreshExpiredTrial(t);
    return toDto(t);
  }

  @Transactional
  public TenantDtos.TenantPanelDto update(UserPrincipal principal, TenantDtos.ProfileUpdateRequest req) {
    Tenant t = require(principal);
    subscriptions.refreshExpiredTrial(t);
    if (!subscriptions.canWritePanel(t)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Panel en solo lectura");
    }
    if (req.name() != null && !req.name().isBlank()) t.setName(req.name());
    if (req.logoUrl() != null) t.setLogoUrl(req.logoUrl());
    if (req.primaryColor() != null) t.setPrimaryColor(normalizeHex(req.primaryColor()));
    if (req.accentColor() != null) t.setAccentColor(normalizeHex(req.accentColor()));
    if (req.province() != null && !req.province().isBlank()) t.setProvince(req.province());
    if (req.city() != null && !req.city().isBlank()) t.setCity(req.city());
    if (req.address() != null) t.setAddress(req.address());
    if (req.whatsapp() != null && !req.whatsapp().isBlank()) t.setWhatsapp(req.whatsapp());
    if (req.email() != null) t.setEmail(req.email());
    if (req.description() != null) t.setDescription(req.description());
    return toDto(t);
  }

  @Transactional
  public TenantDtos.StatsDto stats(UserPrincipal principal) {
    Tenant t = require(principal);
    subscriptions.refreshExpiredTrial(t);
    tenants.save(t);
    return new TenantDtos.StatsDto(
        vehicles.countByTenantIdAndStatus(t.getId(), VehicleStatus.PUBLICADO),
        vehicles.sumViewsByTenant(t.getId()),
        vehicles.sumWaClicksByTenant(t.getId()),
        t.getSubscriptionStatus(),
        t.getTrialEndsAt(),
        subscriptions.isPanelReadOnly(t));
  }

  private TenantDtos.TenantPanelDto toDto(Tenant t) {
    return new TenantDtos.TenantPanelDto(
        t.getId(),
        t.getName(),
        t.getSlug(),
        t.getLogoUrl(),
        t.getPrimaryColor(),
        t.getAccentColor(),
        t.getProvince(),
        t.getCity(),
        t.getAddress(),
        t.getWhatsapp(),
        t.getEmail(),
        t.getDescription(),
        t.getSubscriptionStatus(),
        t.getTrialEndsAt(),
        t.getPlanId(),
        properties.getPlan().getName(),
        blankToNull(properties.getPlan().getPriceUsd()),
        blankToNull(properties.getPlan().getPriceArs()),
        t.getModerationStatus(),
        subscriptions.isPanelReadOnly(t));
  }

  private static String blankToNull(String s) {
    return s == null || s.isBlank() ? null : s;
  }

  /** Acepta #RGB / #RRGGBB; vacío limpia el color. */
  private static String normalizeHex(String raw) {
    if (raw == null || raw.isBlank()) return null;
    String v = raw.trim();
    if (!v.startsWith("#")) v = "#" + v;
    if (!v.matches("(?i)^#([0-9a-f]{3}|[0-9a-f]{6})$")) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Color inválido (use hex, ej. #0B3D4A)");
    }
    return v.toUpperCase();
  }

  private Tenant require(UserPrincipal principal) {
    if (principal.getTenantId() == null) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Usuario sin concesionaria");
    }
    return tenants.findById(principal.getTenantId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
  }
}
