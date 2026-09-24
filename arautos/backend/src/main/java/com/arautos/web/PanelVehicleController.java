package com.arautos.web;

import com.arautos.security.UserPrincipal;
import com.arautos.service.PanelVehicleService;
import com.arautos.web.dto.VehicleDtos;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/panel/vehicles")
public class PanelVehicleController {
  private final PanelVehicleService service;

  public PanelVehicleController(PanelVehicleService service) {
    this.service = service;
  }

  @GetMapping
  public List<VehicleDtos.VehiclePanelDto> list(@AuthenticationPrincipal UserPrincipal principal) {
    return service.listMine(principal);
  }

  @PostMapping
  public VehicleDtos.VehiclePanelDto create(
      @AuthenticationPrincipal UserPrincipal principal,
      @Valid @RequestBody VehicleDtos.VehicleRequest req) {
    return service.create(principal, req);
  }

  @PutMapping("/{id}")
  public VehicleDtos.VehiclePanelDto update(
      @AuthenticationPrincipal UserPrincipal principal,
      @PathVariable UUID id,
      @Valid @RequestBody VehicleDtos.VehicleRequest req) {
    return service.update(principal, id, req);
  }

  @DeleteMapping("/{id}")
  public void delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID id) {
    service.delete(principal, id);
  }
}
