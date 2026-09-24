package com.arautos.web;

import com.arautos.domain.enums.CurrencyCode;
import com.arautos.domain.enums.VehicleType;
import com.arautos.service.CatalogService;
import com.arautos.web.dto.VehicleDtos;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicCatalogController {
  private final CatalogService catalogService;

  public PublicCatalogController(CatalogService catalogService) {
    this.catalogService = catalogService;
  }

  @GetMapping("/catalog")
  public List<VehicleDtos.VehiclePublicDto> catalog(
      @RequestParam(required = false) String brand,
      @RequestParam(required = false) String model,
      @RequestParam(required = false) Integer yearMin,
      @RequestParam(required = false) Integer yearMax,
      @RequestParam(required = false) Integer kmMax,
      @RequestParam(required = false) BigDecimal priceMin,
      @RequestParam(required = false) BigDecimal priceMax,
      @RequestParam(required = false) CurrencyCode currency,
      @RequestParam(required = false) String province,
      @RequestParam(required = false) String city,
      @RequestParam(required = false) VehicleType type) {
    return catalogService.search(brand, model, yearMin, yearMax, kmMax, priceMin, priceMax, currency, province, city, type);
  }

  @GetMapping("/vehicles/{id}")
  public VehicleDtos.VehiclePublicDto vehicle(@PathVariable UUID id) {
    return catalogService.getPublic(id);
  }

  @PostMapping("/vehicles/{id}/view")
  public Map<String, String> view(@PathVariable UUID id) {
    catalogService.incrementView(id);
    return Map.of("status", "ok");
  }

  @PostMapping("/vehicles/{id}/wa-click")
  public Map<String, String> waClick(@PathVariable UUID id) {
    catalogService.incrementWaClick(id);
    return Map.of("status", "ok");
  }
}
