package com.arautos.service;

import com.arautos.config.ArautosProperties;
import com.arautos.domain.Tenant;
import com.arautos.domain.enums.ModerationStatus;
import com.arautos.domain.enums.SubscriptionStatus;
import com.arautos.repo.TenantRepository;
import com.arautos.web.dto.TenantDtos;
import com.arautos.web.error.ApiException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
  private final TenantRepository tenants;
  private final ArautosProperties properties;
  private final SubscriptionService subscriptions;

  public AdminService(TenantRepository tenants, ArautosProperties properties, SubscriptionService subscriptions) {
    this.tenants = tenants;
    this.properties = properties;
    this.subscriptions = subscriptions;
  }

  @Transactional(readOnly = true)
  public List<TenantDtos.TenantPanelDto> pending() {
    return tenants.findByModerationStatus(ModerationStatus.PENDIENTE).stream()
        .map(this::toDto)
        .toList();
  }

  @Transactional
  public TenantDtos.TenantPanelDto approve(UUID tenantId) {
    Tenant t = tenants.findById(tenantId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
    t.setModerationStatus(ModerationStatus.ACTIVA);
    t.setSubscriptionStatus(SubscriptionStatus.TRIAL);
    t.setTrialEndsAt(Instant.now().plus(properties.getTrialDays(), ChronoUnit.DAYS));
    t.setPlanId(properties.getPlan().getId());
    return toDto(t);
  }

  @Transactional
  public TenantDtos.TenantPanelDto suspend(UUID tenantId) {
    Tenant t = tenants.findById(tenantId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
    t.setModerationStatus(ModerationStatus.SUSPENDIDA);
    t.setSubscriptionStatus(SubscriptionStatus.SUSPENDIDA);
    return toDto(t);
  }

  private TenantDtos.TenantPanelDto toDto(Tenant t) {
    subscriptions.refreshExpiredTrial(t);
    return new TenantDtos.TenantPanelDto(
        t.getId(),
        t.getName(),
        t.getSlug(),
        t.getLogoUrl(),
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
        null,
        null,
        t.getModerationStatus(),
        subscriptions.isPanelReadOnly(t));
  }
}
