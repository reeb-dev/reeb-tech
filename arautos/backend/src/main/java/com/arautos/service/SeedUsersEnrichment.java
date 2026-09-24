package com.arautos.service;

import com.arautos.config.ArautosProperties;
import com.arautos.domain.Tenant;
import com.arautos.domain.UserAccount;
import com.arautos.domain.enums.UserRole;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Completa usuarios demo en DBs ya seedadas (sin recrear tenants).
 */
@Component
@Order(50)
public class SeedUsersEnrichment implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(SeedUsersEnrichment.class);

  private final ArautosProperties properties;
  private final TenantRepository tenants;
  private final UserAccountRepository users;
  private final PasswordEncoder passwordEncoder;

  public SeedUsersEnrichment(ArautosProperties properties, TenantRepository tenants,
                             UserAccountRepository users, PasswordEncoder passwordEncoder) {
    this.properties = properties;
    this.tenants = tenants;
    this.users = users;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (!properties.isSeed()) {
      return;
    }
    tenants.findBySlug("patagonia-motors").ifPresent(t ->
        ensureUser(t, "agente1@patagonia-motors.example", "demo123", UserRole.TENANT_AGENT));
  }

  private void ensureUser(Tenant tenant, String email, String password, UserRole role) {
    if (users.existsByEmailIgnoreCase(email)) {
      return;
    }
    UserAccount u = new UserAccount();
    u.setTenant(tenant);
    u.setEmail(email);
    u.setPasswordHash(passwordEncoder.encode(password));
    u.setRole(role);
    u.setActive(true);
    users.save(u);
    log.info("Usuario demo enriquecido: {} ({})", email, role);
  }
}
