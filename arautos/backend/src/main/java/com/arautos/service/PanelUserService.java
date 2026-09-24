package com.arautos.service;

import com.arautos.domain.Tenant;
import com.arautos.domain.UserAccount;
import com.arautos.domain.enums.UserRole;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.UserAccountRepository;
import com.arautos.security.UserPrincipal;
import com.arautos.web.dto.UserDtos;
import com.arautos.web.error.ApiException;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PanelUserService {
  private final UserAccountRepository users;
  private final TenantRepository tenants;
  private final PasswordEncoder passwordEncoder;

  public PanelUserService(UserAccountRepository users, TenantRepository tenants, PasswordEncoder passwordEncoder) {
    this.users = users;
    this.tenants = tenants;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional(readOnly = true)
  public List<UserDtos.UserDto> list(UserPrincipal principal) {
    Tenant tenant = requireTenantAdmin(principal);
    return users.findByTenant_IdOrderByCreatedAtAsc(tenant.getId()).stream().map(this::toDto).toList();
  }

  @Transactional
  public UserDtos.UserDto create(UserPrincipal principal, UserDtos.CreateUserRequest req) {
    Tenant tenant = requireTenantAdmin(principal);
    if (req.email() == null || req.email().isBlank()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Indique el email del usuario");
    }
    if (req.password() == null || req.password().length() < 6) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 6 caracteres");
    }
    UserRole role = normalizeTenantRole(req.role());
    String email = req.email().trim().toLowerCase(Locale.ROOT);
    if (users.existsByEmailIgnoreCase(email)) {
      throw new ApiException(HttpStatus.CONFLICT, "Ese email ya está registrado");
    }
    UserAccount user = new UserAccount();
    user.setTenant(tenant);
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(req.password()));
    user.setDisplayName(normalizeName(req.displayName(), email));
    user.setRole(role);
    user.setActive(true);
    return toDto(users.save(user));
  }

  @Transactional
  public UserDtos.UserDto updateProfile(UserPrincipal principal, UUID userId, UserDtos.UpdateProfileRequest req) {
    Tenant tenant = requireTenantAdmin(principal);
    UserAccount target = users.findByIdAndTenant_Id(userId, tenant.getId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Perfil no encontrado en su local"));
    if (req.displayName() != null) {
      target.setDisplayName(normalizeName(req.displayName(), target.getEmail()));
    }
    if (req.role() != null) {
      UserRole newRole = normalizeTenantRole(req.role());
      if (target.getId().equals(principal.getUserId()) && newRole != UserRole.TENANT_ADMIN) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "No puede quitarse el rol de administrador a sí mismo");
      }
      if (target.getRole() == UserRole.TENANT_ADMIN && newRole != UserRole.TENANT_ADMIN) {
        ensureAnotherAdmin(tenant.getId(), target.getId());
      }
      target.setRole(newRole);
    }
    return toDto(target);
  }

  @Transactional
  public UserDtos.UserDto updateRole(UserPrincipal principal, UUID userId, UserDtos.UpdateRoleRequest req) {
    Tenant tenant = requireTenantAdmin(principal);
    UserAccount target = users.findByIdAndTenant_Id(userId, tenant.getId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado en su local"));
    UserRole newRole = normalizeTenantRole(req.role());
    if (target.getId().equals(principal.getUserId()) && newRole != UserRole.TENANT_ADMIN) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "No puede quitarse el rol de administrador a sí mismo");
    }
    if (target.getRole() == UserRole.TENANT_ADMIN && newRole != UserRole.TENANT_ADMIN) {
      ensureAnotherAdmin(tenant.getId(), target.getId());
    }
    target.setRole(newRole);
    return toDto(target);
  }

  @Transactional
  public UserDtos.UserDto setActive(UserPrincipal principal, UUID userId, boolean active) {
    Tenant tenant = requireTenantAdmin(principal);
    UserAccount target = users.findByIdAndTenant_Id(userId, tenant.getId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado en su local"));
    if (target.getId().equals(principal.getUserId())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "No puede desactivar su propia cuenta");
    }
    if (!active && target.getRole() == UserRole.TENANT_ADMIN) {
      ensureAnotherAdmin(tenant.getId(), target.getId());
    }
    target.setActive(active);
    return toDto(target);
  }

  @Transactional
  public void delete(UserPrincipal principal, UUID userId) {
    Tenant tenant = requireTenantAdmin(principal);
    UserAccount target = users.findByIdAndTenant_Id(userId, tenant.getId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado en su local"));
    if (target.getId().equals(principal.getUserId())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "No puede borrar su propia cuenta");
    }
    if (target.getRole() == UserRole.TENANT_ADMIN) {
      ensureAnotherAdmin(tenant.getId(), target.getId());
    }
    users.delete(target);
  }

  private void ensureAnotherAdmin(UUID tenantId, UUID excludingUserId) {
    long otherAdmins = users.findByTenant_IdOrderByCreatedAtAsc(tenantId).stream()
        .filter(u -> u.isActive()
            && u.getRole() == UserRole.TENANT_ADMIN
            && !u.getId().equals(excludingUserId))
        .count();
    if (otherAdmins < 1) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Debe quedar al menos un administrador activo en el local");
    }
  }

  private UserRole normalizeTenantRole(UserRole role) {
    if (role == null) {
      return UserRole.TENANT_AGENT;
    }
    if (role == UserRole.PLATFORM_ADMIN) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "No puede asignar el rol de plataforma desde el local");
    }
    if (role != UserRole.TENANT_ADMIN && role != UserRole.TENANT_AGENT) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Rol no permitido");
    }
    return role;
  }

  private Tenant requireTenantAdmin(UserPrincipal principal) {
    if (principal.getRole() != UserRole.TENANT_ADMIN) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Solo el administrador del local puede gestionar usuarios");
    }
    if (principal.getTenantId() == null) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Usuario sin concesionaria");
    }
    return tenants.findById(principal.getTenantId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
  }

  private String normalizeName(String raw, String emailFallback) {
    if (raw != null && !raw.isBlank()) {
      return raw.trim();
    }
    int at = emailFallback.indexOf('@');
    return at > 0 ? emailFallback.substring(0, at) : emailFallback;
  }

  private UserDtos.UserDto toDto(UserAccount u) {
    return new UserDtos.UserDto(
        u.getId(),
        u.getEmail(),
        u.getDisplayName(),
        u.getRole(),
        u.isActive(),
        u.getCreatedAt());
  }
}
