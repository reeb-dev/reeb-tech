package com.arautos.web;

import com.arautos.service.AdminService;
import com.arautos.web.dto.TenantDtos;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final AdminService adminService;

  public AdminController(AdminService adminService) {
    this.adminService = adminService;
  }

  @GetMapping("/tenants/pending")
  public List<TenantDtos.TenantPanelDto> pending() {
    return adminService.pending();
  }

  @GetMapping("/tenants")
  public List<TenantDtos.TenantPanelDto> listAll() {
    return adminService.listAll();
  }

  @PostMapping("/tenants/{id}/approve")
  public TenantDtos.TenantPanelDto approve(@PathVariable UUID id) {
    return adminService.approve(id);
  }

  @PostMapping("/tenants/{id}/suspend")
  public TenantDtos.TenantPanelDto suspend(@PathVariable UUID id) {
    return adminService.suspend(id);
  }
}
