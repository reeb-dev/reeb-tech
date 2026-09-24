package com.arautos.service;

import com.arautos.config.ArautosProperties;
import com.arautos.domain.Tenant;
import com.arautos.domain.UserAccount;
import com.arautos.domain.enums.ModerationStatus;
import com.arautos.domain.enums.SubscriptionStatus;
import com.arautos.domain.enums.UserRole;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.UserAccountRepository;
import com.arautos.security.JwtService;
import com.arautos.web.dto.AuthDtos;
import com.arautos.web.error.ApiException;
import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserAccountRepository users;
  private final TenantRepository tenants;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final ArautosProperties properties;

  public AuthService(UserAccountRepository users, TenantRepository tenants, PasswordEncoder passwordEncoder,
                     JwtService jwtService, ArautosProperties properties) {
    this.users = users;
    this.tenants = tenants;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.properties = properties;
  }

  @Transactional
  public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest req) {
    if (users.existsByEmailIgnoreCase(req.email())) {
      throw new ApiException(HttpStatus.CONFLICT, "Email ya registrado");
    }
    String slug = uniqueSlug(req.slug() != null && !req.slug().isBlank() ? req.slug() : req.dealerName());

    Tenant tenant = new Tenant();
    tenant.setName(req.dealerName());
    tenant.setSlug(slug);
    tenant.setProvince(req.province());
    tenant.setCity(req.city());
    tenant.setAddress(req.address());
    tenant.setWhatsapp(req.whatsapp());
    tenant.setEmail(req.email());
    tenant.setDescription(req.description());
    tenant.setModerationStatus(ModerationStatus.PENDIENTE);
    tenant.setSubscriptionStatus(SubscriptionStatus.PENDIENTE_PAGO);
    tenant.setPlanId(properties.getPlan().getId());
    tenants.save(tenant);

    UserAccount user = new UserAccount();
    user.setTenant(tenant);
    user.setEmail(req.email().trim().toLowerCase(Locale.ROOT));
    user.setPasswordHash(passwordEncoder.encode(req.password()));
    user.setRole(UserRole.TENANT_ADMIN);
    users.save(user);

    return toAuth(user, tenant, "Registro recibido. Un administrador debe aprobar su cuenta antes del trial.");
  }

  @Transactional(readOnly = true)
  public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
    UserAccount user = users.findByEmailIgnoreCase(req.email())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
    if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
    }
    Tenant tenant = user.getTenant();
    return toAuth(user, tenant, null);
  }

  private AuthDtos.AuthResponse toAuth(UserAccount user, Tenant tenant, String message) {
    UUID tenantId = tenant != null ? tenant.getId() : null;
    String token = jwtService.issue(user.getId(), tenantId, user.getEmail(), user.getRole());
    return new AuthDtos.AuthResponse(
        token,
        user.getId(),
        user.getEmail(),
        user.getRole().name(),
        tenantId,
        tenant != null ? tenant.getSlug() : null,
        tenant != null ? tenant.getName() : null,
        tenant != null ? tenant.getSubscriptionStatus().name() : null,
        tenant != null ? tenant.getModerationStatus().name() : null,
        message);
  }

  private String uniqueSlug(String raw) {
    String base = slugify(raw);
    if (base.isBlank()) base = "concesionaria";
    String candidate = base;
    int i = 2;
    while (tenants.existsBySlug(candidate)) {
      candidate = base + "-" + i++;
    }
    return candidate;
  }

  static String slugify(String input) {
    String n = Normalizer.normalize(input, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    return n.toLowerCase(Locale.ROOT)
        .replaceAll("[^a-z0-9]+", "-")
        .replaceAll("(^-|-$)", "");
  }
}
