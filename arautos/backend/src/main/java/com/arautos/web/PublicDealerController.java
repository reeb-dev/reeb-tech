package com.arautos.web;

import com.arautos.service.CatalogService;
import com.arautos.web.dto.TenantDtos;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicDealerController {
  private final CatalogService catalogService;

  public PublicDealerController(CatalogService catalogService) {
    this.catalogService = catalogService;
  }

  @GetMapping("/c/{slug}")
  public TenantDtos.TenantPublicDto bySlug(@PathVariable String slug) {
    return catalogService.profileBySlug(slug);
  }
}
