package com.arautos.service;

import com.arautos.domain.Tenant;
import com.arautos.domain.Vehicle;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.VehicleRepository;
import com.arautos.security.UserPrincipal;
import com.arautos.web.dto.VehicleDtos;
import com.arautos.web.error.ApiException;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PanelVehicleService {
  private final VehicleRepository vehicles;
  private final TenantRepository tenants;
  private final SubscriptionService subscriptions;

  public PanelVehicleService(VehicleRepository vehicles, TenantRepository tenants, SubscriptionService subscriptions) {
    this.vehicles = vehicles;
    this.tenants = tenants;
    this.subscriptions = subscriptions;
  }

  @Transactional(readOnly = true)
  public List<VehicleDtos.VehiclePanelDto> listMine(UserPrincipal principal) {
    requireTenant(principal);
    return vehicles.findByTenantIdOrderByCreatedAtDesc(principal.getTenantId()).stream()
        .map(VehicleMapper::toPanel)
        .toList();
  }

  @Transactional
  public VehicleDtos.VehiclePanelDto create(UserPrincipal principal, VehicleDtos.VehicleRequest req) {
    Tenant tenant = writableTenant(principal);
    Vehicle v = new Vehicle();
    v.setTenant(tenant);
    VehicleMapper.apply(v, req);
    if (v.getPhotos().isEmpty()) {
      v.setPhotos(List.of("https://placehold.co/800x500/1a1a1a/ffffff?text=" + v.getBrand() + "+" + v.getModel()));
    }
    vehicles.save(v);
    return VehicleMapper.toPanel(v);
  }

  @Transactional
  public VehicleDtos.VehiclePanelDto update(UserPrincipal principal, UUID id, VehicleDtos.VehicleRequest req) {
    Tenant tenant = writableTenant(principal);
    Vehicle v = vehicles.findByIdAndTenantId(id, tenant.getId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Aviso no encontrado"));
    VehicleMapper.apply(v, req);
    return VehicleMapper.toPanel(v);
  }

  @Transactional
  public void delete(UserPrincipal principal, UUID id) {
    Tenant tenant = writableTenant(principal);
    Vehicle v = vehicles.findByIdAndTenantId(id, tenant.getId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Aviso no encontrado"));
    vehicles.delete(v);
  }

  private Tenant requireTenant(UserPrincipal principal) {
    if (principal.getTenantId() == null) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Usuario sin concesionaria");
    }
    return tenants.findById(principal.getTenantId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
  }

  private Tenant writableTenant(UserPrincipal principal) {
    Tenant tenant = requireTenant(principal);
    subscriptions.refreshExpiredTrial(tenant);
    tenants.save(tenant);
    if (!subscriptions.canWritePanel(tenant)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Panel en solo lectura o sin suscripción vigente");
    }
    return tenant;
  }
}
