package com.arautos.domain;

import com.arautos.domain.enums.UserRole;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserAccount {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(name = "tenant_id")
  private Tenant tenant;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String passwordHash;

  /** ID de usuario Facebook (login OAuth). Null si solo email/password. */
  @Column(length = 64, unique = true)
  private String facebookUserId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 32)
  private UserRole role = UserRole.TENANT_ADMIN;

  /** Si es false, no puede iniciar sesión. */
  @Column(nullable = false, columnDefinition = "boolean default true")
  private boolean active = true;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public Tenant getTenant() { return tenant; }
  public void setTenant(Tenant tenant) { this.tenant = tenant; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
  public String getFacebookUserId() { return facebookUserId; }
  public void setFacebookUserId(String facebookUserId) { this.facebookUserId = facebookUserId; }
  public UserRole getRole() { return role; }
  public void setRole(UserRole role) { this.role = role; }
  public boolean isActive() { return active; }
  public void setActive(boolean active) { this.active = active; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
