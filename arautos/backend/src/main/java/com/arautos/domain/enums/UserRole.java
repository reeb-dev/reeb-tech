package com.arautos.domain.enums;

public enum UserRole {
  /** Dueño / administrador del local. */
  TENANT_ADMIN,
  /** Agente del local (stock y panel; sin gestión de usuarios). */
  TENANT_AGENT,
  /** Admin de la plataforma ArAutos. */
  PLATFORM_ADMIN
}
