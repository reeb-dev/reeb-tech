package com.arautos.web.dto;

import com.arautos.domain.enums.UserRole;
import java.time.Instant;
import java.util.UUID;

public final class UserDtos {
  private UserDtos() {}

  public record UserDto(
      UUID id,
      String email,
      UserRole role,
      boolean active,
      Instant createdAt) {}

  public record CreateUserRequest(
      String email,
      String password,
      UserRole role) {}

  public record UpdateRoleRequest(UserRole role) {}
}
