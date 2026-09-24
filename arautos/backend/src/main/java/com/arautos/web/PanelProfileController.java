package com.arautos.web;

import com.arautos.security.UserPrincipal;
import com.arautos.service.TenantPanelService;
import com.arautos.web.dto.TenantDtos;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/panel")
public class PanelProfileController {
  private final TenantPanelService service;

  public PanelProfileController(TenantPanelService service) {
    this.service = service;
  }

  @GetMapping("/profile")
  public TenantDtos.TenantPanelDto profile(@AuthenticationPrincipal UserPrincipal principal) {
    return service.profile(principal);
  }

  @PutMapping("/profile")
  public TenantDtos.TenantPanelDto update(
      @AuthenticationPrincipal UserPrincipal principal,
      @RequestBody TenantDtos.ProfileUpdateRequest req) {
    return service.update(principal, req);
  }

  @GetMapping("/stats")
  public TenantDtos.StatsDto stats(@AuthenticationPrincipal UserPrincipal principal) {
    return service.stats(principal);
  }
}
