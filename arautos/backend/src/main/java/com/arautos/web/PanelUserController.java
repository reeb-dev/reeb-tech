package com.arautos.web;

import com.arautos.security.UserPrincipal;
import com.arautos.service.PanelUserService;
import com.arautos.web.dto.UserDtos;
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
@RequestMapping("/api/panel/users")
public class PanelUserController {
  private final PanelUserService service;

  public PanelUserController(PanelUserService service) {
    this.service = service;
  }

  @GetMapping
  public List<UserDtos.UserDto> list(@AuthenticationPrincipal UserPrincipal principal) {
    return service.list(principal);
  }

  @PostMapping
  public UserDtos.UserDto create(
      @AuthenticationPrincipal UserPrincipal principal,
      @RequestBody UserDtos.CreateUserRequest req) {
    return service.create(principal, req);
  }

  @PutMapping("/{id}/role")
  public UserDtos.UserDto updateRole(
      @AuthenticationPrincipal UserPrincipal principal,
      @PathVariable UUID id,
      @RequestBody UserDtos.UpdateRoleRequest req) {
    return service.updateRole(principal, id, req);
  }

  @PutMapping("/{id}")
  public UserDtos.UserDto updateProfile(
      @AuthenticationPrincipal UserPrincipal principal,
      @PathVariable UUID id,
      @RequestBody UserDtos.UpdateProfileRequest req) {
    return service.updateProfile(principal, id, req);
  }

  @PostMapping("/{id}/deactivate")
  public UserDtos.UserDto deactivate(
      @AuthenticationPrincipal UserPrincipal principal,
      @PathVariable UUID id) {
    return service.setActive(principal, id, false);
  }

  @PostMapping("/{id}/activate")
  public UserDtos.UserDto activate(
      @AuthenticationPrincipal UserPrincipal principal,
      @PathVariable UUID id) {
    return service.setActive(principal, id, true);
  }

  @DeleteMapping("/{id}")
  public void delete(
      @AuthenticationPrincipal UserPrincipal principal,
      @PathVariable UUID id) {
    service.delete(principal, id);
  }
}
