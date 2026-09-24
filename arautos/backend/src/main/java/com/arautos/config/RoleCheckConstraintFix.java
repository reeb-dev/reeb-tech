package com.arautos.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Hibernate crea CHECK de enums al primer arranque; al agregar TENANT_AGENT hay
 * que ampliar el constraint sin recrear la DB.
 */
@Component
@Order(10)
public class RoleCheckConstraintFix implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(RoleCheckConstraintFix.class);
  private final JdbcTemplate jdbc;

  public RoleCheckConstraintFix(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Override
  public void run(ApplicationArguments args) {
    try {
      jdbc.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
      jdbc.execute("""
          ALTER TABLE users ADD CONSTRAINT users_role_check
          CHECK (role::text = ANY (ARRAY['TENANT_ADMIN'::varchar, 'TENANT_AGENT'::varchar, 'PLATFORM_ADMIN'::varchar]::text[]))
          """);
      log.info("Constraint users_role_check actualizado (incluye TENANT_AGENT)");
    } catch (Exception e) {
      log.warn("No se pudo ajustar users_role_check: {}", e.getMessage());
    }
  }
}
