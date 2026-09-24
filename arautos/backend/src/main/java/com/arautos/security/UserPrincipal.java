package com.arautos.security;

import com.arautos.domain.enums.UserRole;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails {
  private final UUID userId;
  private final UUID tenantId;
  private final String email;
  private final String passwordHash;
  private final UserRole role;

  public UserPrincipal(UUID userId, UUID tenantId, String email, String passwordHash, UserRole role) {
    this.userId = userId;
    this.tenantId = tenantId;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  public UUID getUserId() { return userId; }
  public UUID getTenantId() { return tenantId; }
  public UserRole getRole() { return role; }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
  }

  @Override public String getPassword() { return passwordHash; }
  @Override public String getUsername() { return email; }
  @Override public boolean isAccountNonExpired() { return true; }
  @Override public boolean isAccountNonLocked() { return true; }
  @Override public boolean isCredentialsNonExpired() { return true; }
  @Override public boolean isEnabled() { return true; }
}
