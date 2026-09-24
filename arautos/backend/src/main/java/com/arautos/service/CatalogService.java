package com.arautos.service;

import com.arautos.domain.Tenant;
import com.arautos.domain.Vehicle;
import com.arautos.domain.enums.CurrencyCode;
import com.arautos.domain.enums.VehicleStatus;
import com.arautos.domain.enums.VehicleType;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.VehicleRepository;
import com.arautos.web.dto.TenantDtos;
import com.arautos.web.dto.VehicleDtos;
import com.arautos.web.error.ApiException;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CatalogService {
  private final VehicleRepository vehicles;
  private final TenantRepository tenants;
  private final SubscriptionService subscriptions;

  public CatalogService(VehicleRepository vehicles, TenantRepository tenants, SubscriptionService subscriptions) {
    this.vehicles = vehicles;
    this.tenants = tenants;
    this.subscriptions = subscriptions;
  }

  @Transactional(readOnly = true)
  public List<VehicleDtos.VehiclePublicDto> search(
      String brand, String model, Integer yearMin, Integer yearMax, Integer kmMax,
      BigDecimal priceMin, BigDecimal priceMax, CurrencyCode currency,
      String province, String city, VehicleType type) {
    Specification<Vehicle> spec = (root, query, cb) -> {
      List<Predicate> preds = new ArrayList<>();
      if (query.getResultType() != Long.class && query.getResultType() != long.class) {
        root.fetch("tenant", JoinType.LEFT);
      }
      preds.add(cb.equal(root.get("status"), VehicleStatus.PUBLICADO));
      if (brand != null && !brand.isBlank()) {
        preds.add(cb.equal(cb.lower(root.get("brand")), brand.toLowerCase()));
      }
      if (model != null && !model.isBlank()) {
        preds.add(cb.like(cb.lower(root.get("model")), "%" + model.toLowerCase() + "%"));
      }
      if (yearMin != null) preds.add(cb.greaterThanOrEqualTo(root.get("year"), yearMin));
      if (yearMax != null) preds.add(cb.lessThanOrEqualTo(root.get("year"), yearMax));
      if (kmMax != null) preds.add(cb.lessThanOrEqualTo(root.get("km"), kmMax));
      if (priceMin != null) preds.add(cb.greaterThanOrEqualTo(root.get("price"), priceMin));
      if (priceMax != null) preds.add(cb.lessThanOrEqualTo(root.get("price"), priceMax));
      if (currency != null) preds.add(cb.equal(root.get("currency"), currency));
      if (province != null && !province.isBlank()) {
        preds.add(cb.equal(cb.lower(root.get("province")), province.toLowerCase()));
      }
      if (city != null && !city.isBlank()) {
        preds.add(cb.equal(cb.lower(root.get("city")), city.toLowerCase()));
      }
      if (type != null) preds.add(cb.equal(root.get("type"), type));
      query.distinct(true);
      return cb.and(preds.toArray(new Predicate[0]));
    };

    return vehicles.findAll(spec).stream()
        .filter(v -> subscriptions.canListInCatalog(v.getTenant()))
        .map(VehicleMapper::toPublic)
        .toList();
  }

  @Transactional(readOnly = true)
  public VehicleDtos.VehiclePublicDto getPublic(UUID id) {
    Vehicle v = vehicles.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Aviso no encontrado"));
    if (v.getStatus() != VehicleStatus.PUBLICADO || !subscriptions.canListInCatalog(v.getTenant())) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Aviso no disponible");
    }
    return VehicleMapper.toPublic(v);
  }

  @Transactional
  public void incrementView(UUID id) {
    Vehicle v = vehicles.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Aviso no encontrado"));
    if (v.getStatus() != VehicleStatus.PUBLICADO || !subscriptions.canListInCatalog(v.getTenant())) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Aviso no disponible");
    }
    vehicles.incrementViews(id);
  }

  @Transactional
  public void incrementWaClick(UUID id) {
    Vehicle v = vehicles.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Aviso no encontrado"));
    if (v.getStatus() != VehicleStatus.PUBLICADO || !subscriptions.canListInCatalog(v.getTenant())) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Aviso no disponible");
    }
    vehicles.incrementWaClicks(id);
  }

  @Transactional(readOnly = true)
  public TenantDtos.TenantPublicDto profileBySlug(String slug) {
    Tenant tenant = tenants.findBySlug(slug)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
    if (!subscriptions.canListInCatalog(tenant)) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Perfil no disponible");
    }
    List<VehicleDtos.VehiclePublicDto> list = vehicles.findByTenantIdOrderByCreatedAtDesc(tenant.getId()).stream()
        .filter(v -> v.getStatus() == VehicleStatus.PUBLICADO)
        .map(VehicleMapper::toPublic)
        .toList();
    return new TenantDtos.TenantPublicDto(
        tenant.getId(),
        tenant.getName(),
        tenant.getSlug(),
        tenant.getLogoUrl(),
        tenant.getPrimaryColor(),
        tenant.getAccentColor(),
        tenant.getProvince(),
        tenant.getCity(),
        tenant.getAddress(),
        tenant.getWhatsapp(),
        tenant.getEmail(),
        tenant.getDescription(),
        list);
  }
}
