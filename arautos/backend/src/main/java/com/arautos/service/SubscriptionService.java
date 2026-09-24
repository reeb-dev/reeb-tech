package com.arautos.service;

import com.arautos.domain.Tenant;
import com.arautos.domain.enums.ModerationStatus;
import com.arautos.domain.enums.SubscriptionStatus;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionService {

  /** Lista en catálogo público solo si moderación activa y trial vigente o activa. */
  public boolean canListInCatalog(Tenant tenant) {
    if (tenant.getModerationStatus() != ModerationStatus.ACTIVA) {
      return false;
    }
    refreshExpiredTrial(tenant);
    return switch (tenant.getSubscriptionStatus()) {
      case ACTIVA -> true;
      case TRIAL -> tenant.getTrialEndsAt() != null && tenant.getTrialEndsAt().isAfter(Instant.now());
      case PENDIENTE_PAGO, VENCIDA, SUSPENDIDA -> false;
    };
  }

  public boolean isPanelReadOnly(Tenant tenant) {
    refreshExpiredTrial(tenant);
    return tenant.getSubscriptionStatus() == SubscriptionStatus.VENCIDA
        || tenant.getSubscriptionStatus() == SubscriptionStatus.SUSPENDIDA
        || tenant.getModerationStatus() == ModerationStatus.SUSPENDIDA;
  }

  public boolean canWritePanel(Tenant tenant) {
    if (tenant.getModerationStatus() != ModerationStatus.ACTIVA) {
      return false;
    }
    refreshExpiredTrial(tenant);
    return switch (tenant.getSubscriptionStatus()) {
      case ACTIVA -> true;
      case TRIAL -> tenant.getTrialEndsAt() != null && tenant.getTrialEndsAt().isAfter(Instant.now());
      case PENDIENTE_PAGO, VENCIDA, SUSPENDIDA -> false;
    };
  }

  public void refreshExpiredTrial(Tenant tenant) {
    if (tenant.getSubscriptionStatus() == SubscriptionStatus.TRIAL
        && tenant.getTrialEndsAt() != null
        && !tenant.getTrialEndsAt().isAfter(Instant.now())) {
      tenant.setSubscriptionStatus(SubscriptionStatus.VENCIDA);
    }
  }
}
