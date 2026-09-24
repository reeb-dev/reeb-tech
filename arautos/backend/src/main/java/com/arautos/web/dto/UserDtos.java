package com.arautos.web.dto;

import com.arautos.domain.enums.UserRole;
import java.time.Instant;
import java.util.UUID;

public final class UserDtos {
  private UserDtos() {}

  public record UserDto(
      UUID id,
      String email,
      String displayName,
      UserRole role,
      boolean active,
      Instant createdAt) {}

  public record CreateUserRequest(
      String email,
      String password,
      String displayName,
      UserRole role) {}

  public record UpdateRoleRequest(UserRole role) {}

  public record UpdateProfileRequest(String displayName, UserRole role) {}
}
