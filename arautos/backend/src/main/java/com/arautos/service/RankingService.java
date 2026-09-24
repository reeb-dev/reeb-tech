package com.arautos.service;

import com.arautos.domain.Tenant;
import com.arautos.domain.enums.ModerationStatus;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.VehicleRepository;
import com.arautos.security.UserPrincipal;
import com.arautos.web.dto.RankingDtos;
import com.arautos.web.error.ApiException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Fase 1c — ranking de panel por provincia, criterio clics WhatsApp.
 * Solo visible para usuarios logueados del panel; no es público.
 */
@Service
public class RankingService {
  private final TenantRepository tenants;
  private final VehicleRepository vehicles;

  public RankingService(TenantRepository tenants, VehicleRepository vehicles) {
    this.tenants = tenants;
    this.vehicles = vehicles;
  }

  @Transactional(readOnly = true)
  public RankingDtos.RankingResponse rankingForPanel(UserPrincipal principal, String provinceOverride) {
    Tenant self = requireTenant(principal);
    String province = (provinceOverride != null && !provinceOverride.isBlank())
        ? provinceOverride.trim()
        : self.getProvince();

    List<Tenant> peers = tenants.findAll().stream()
        .filter(t -> t.getModerationStatus() == ModerationStatus.ACTIVA)
        .filter(t -> t.getProvince() != null && t.getProvince().equalsIgnoreCase(province))
        .toList();

    record Row(Tenant t, long wa) {}
    List<Row> rows = new ArrayList<>();
    for (Tenant t : peers) {
      rows.add(new Row(t, vehicles.sumWaClicksByTenant(t.getId())));
    }
    rows.sort(Comparator.comparingLong(Row::wa).reversed().thenComparing(r -> r.t().getName()));

    List<RankingDtos.RankingEntry> entries = new ArrayList<>();
    int rank = 1;
    for (Row row : rows) {
      entries.add(new RankingDtos.RankingEntry(
          rank++,
          row.t().getId(),
          row.t().getName(),
          row.t().getSlug(),
          row.t().getProvince(),
          row.wa(),
          row.t().getId().equals(self.getId())));
    }
    return new RankingDtos.RankingResponse(province, entries, "clics_whatsapp");
  }

  private Tenant requireTenant(UserPrincipal principal) {
    if (principal.getTenantId() == null) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Usuario sin concesionaria");
    }
    return tenants.findById(principal.getTenantId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
  }
}
