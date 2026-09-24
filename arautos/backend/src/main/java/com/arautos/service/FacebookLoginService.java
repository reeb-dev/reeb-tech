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
import com.arautos.service.meta.MetaGraphClient;
import com.arautos.web.dto.AuthDtos;
import com.arautos.web.dto.SocialDtos;
import com.arautos.web.error.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class FacebookLoginService {
  private static final String SCOPE_LOGIN = "email,public_profile";
  private static final long STATE_TTL_MS = 10 * 60 * 1000L;

  private final ArautosProperties properties;
  private final MetaGraphClient graph;
  private final UserAccountRepository users;
  private final TenantRepository tenants;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final SecretKey stateKey;

  public FacebookLoginService(ArautosProperties properties, MetaGraphClient graph,
                              UserAccountRepository users, TenantRepository tenants,
                              PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.properties = properties;
    this.graph = graph;
    this.users = users;
    this.tenants = tenants;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    byte[] bytes = properties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
    this.stateKey = Keys.hmacShaKeyFor(bytes);
  }

  public SocialDtos.ProviderStatus providerStatus() {
    ArautosProperties.FacebookOAuth fb = properties.getFacebookOAuth();
    boolean configured = fb.isConfigured();
    String note = configured
        ? "Facebook Login listo (cuenta AR Autos). Conectar redes es otro flujo en el panel."
        : "Configure ARAUTOS_OAUTH_FACEBOOK_* en el .env local. No pegue secrets en el chat.";
    return new SocialDtos.ProviderStatus("facebook", fb.isEnabled(), configured, note);
  }

  /** @deprecated use {@link #providerStatus()} — kept for callers that still expect list. */
  public SocialDtos.ProvidersResponse providers() {
    return new SocialDtos.ProvidersResponse(List.of(providerStatus()));
  }

  public String startUrl() {
    requireConfigured();
    ArautosProperties.FacebookOAuth fb = properties.getFacebookOAuth();
    String state = signState("login", null);
    return "https://www.facebook.com/" + fb.getGraphVersion() + "/dialog/oauth"
        + "?client_id=" + enc(fb.getClientId())
        + "&redirect_uri=" + enc(fb.getLoginRedirectUri())
        + "&state=" + enc(state)
        + "&scope=" + enc(SCOPE_LOGIN)
        + "&response_type=code";
  }

  @Transactional
  public String handleCallback(String code, String state, String error) {
    ArautosProperties.FacebookOAuth fb = properties.getFacebookOAuth();
    if (error != null && !error.isBlank()) {
      return failRedirect("meta_denied");
    }
    if (!fb.isConfigured()) {
      return failRedirect("not_configured");
    }
    try {
      Claims claims = parseState(state);
      if (!"login".equals(claims.get("purpose", String.class))) {
        return failRedirect("invalid_state");
      }
      String shortToken = graph.exchangeCode(code, fb.getLoginRedirectUri());
      String userToken = graph.exchangeLongLivedUserToken(shortToken);
      JsonNode me = graph.me(userToken);
      String fbId = text(me, "id");
      String email = text(me, "email");
      String name = text(me, "name");
      if (fbId == null) {
        return failRedirect("no_profile");
      }
      AuthDtos.AuthResponse auth = loginOrCreate(fbId, email, name);
      UriComponentsBuilder b = UriComponentsBuilder.fromUriString(fb.getFrontendLoginSuccessUrl())
          .queryParam("token", auth.token())
          .queryParam("provider", "facebook")
          .queryParam("email", auth.email())
          .queryParam("role", auth.role())
          .queryParam("userId", auth.userId().toString());
      if (auth.tenantId() != null) b.queryParam("tenantId", auth.tenantId().toString());
      if (auth.tenantSlug() != null) b.queryParam("tenantSlug", auth.tenantSlug());
      if (auth.tenantName() != null) b.queryParam("tenantName", auth.tenantName());
      if (auth.subscriptionStatus() != null) b.queryParam("subscriptionStatus", auth.subscriptionStatus());
      if (auth.moderationStatus() != null) b.queryParam("moderationStatus", auth.moderationStatus());
      if (auth.message() != null) b.queryParam("message", auth.message());
      return b.build(true).toUriString();
    } catch (ApiException e) {
      return failRedirect("oauth_error");
    } catch (Exception e) {
      return failRedirect("oauth_error");
    }
  }

  private AuthDtos.AuthResponse loginOrCreate(String fbId, String email, String name) {
    Optional<UserAccount> byFb = users.findByFacebookUserId(fbId);
    if (byFb.isPresent()) {
      return toAuth(byFb.get());
    }
    if (email != null && !email.isBlank()) {
      Optional<UserAccount> byEmail = users.findByEmailIgnoreCase(email);
      if (byEmail.isPresent()) {
        UserAccount u = byEmail.get();
        u.setFacebookUserId(fbId);
        users.save(u);
        return toAuth(u);
      }
    }
    String safeEmail = email != null && !email.isBlank()
        ? email.trim().toLowerCase(Locale.ROOT)
        : ("fb-" + fbId + "@oauth.arautos.local");
    if (users.existsByEmailIgnoreCase(safeEmail)) {
      throw new ApiException(HttpStatus.CONFLICT, "Email ya registrado");
    }
    String dealerName = (name != null && !name.isBlank()) ? name : "Concesionaria Facebook";
    Tenant tenant = new Tenant();
    tenant.setName(dealerName);
    tenant.setSlug(uniqueSlug(dealerName));
    tenant.setProvince("A completar");
    tenant.setCity("A completar");
    tenant.setWhatsapp("5490000000000");
    tenant.setEmail(safeEmail.contains("@oauth.arautos.local") ? null : safeEmail);
    tenant.setDescription("Alta vía Facebook Login. Complete provincia, ciudad y WhatsApp.");
    tenant.setModerationStatus(ModerationStatus.PENDIENTE);
    tenant.setSubscriptionStatus(SubscriptionStatus.PENDIENTE_PAGO);
    tenant.setPlanId(properties.getPlan().getId());
    tenants.save(tenant);

    UserAccount user = new UserAccount();
    user.setTenant(tenant);
    user.setEmail(safeEmail);
    user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
    user.setFacebookUserId(fbId);
    user.setRole(UserRole.TENANT_ADMIN);
    users.save(user);
    return toAuth(user, "Cuenta creada con Facebook. Complete el perfil; un administrador debe aprobar el alta.");
  }

  private AuthDtos.AuthResponse toAuth(UserAccount user) {
    return toAuth(user, null);
  }

  private AuthDtos.AuthResponse toAuth(UserAccount user, String message) {
    if (!user.isActive()) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Cuenta desactivada");
    }
    Tenant tenant = user.getTenant();
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

  private String failRedirect(String code) {
    return UriComponentsBuilder.fromUriString(properties.getFacebookOAuth().getFrontendLoginSuccessUrl())
        .queryParam("oauth_error", code)
        .build(true)
        .toUriString();
  }

  private void requireConfigured() {
    if (!properties.getFacebookOAuth().isConfigured()) {
      throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
          "Facebook OAuth no configurado. Defina ARAUTOS_OAUTH_FACEBOOK_* en el .env.");
    }
  }

  public String signState(String purpose, UUID userId) {
    long now = System.currentTimeMillis();
    var builder = Jwts.builder()
        .claim("purpose", purpose)
        .issuedAt(new Date(now))
        .expiration(new Date(now + STATE_TTL_MS))
        .signWith(stateKey);
    if (userId != null) {
      builder.subject(userId.toString());
    }
    return builder.compact();
  }

  public Claims parseState(String state) {
    if (state == null || state.isBlank()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "state inválido");
    }
    return Jwts.parser().verifyWith(stateKey).build().parseSignedClaims(state).getPayload();
  }

  private String uniqueSlug(String raw) {
    String base = AuthService.slugify(raw);
    if (base.isBlank()) base = "concesionaria";
    String candidate = base;
    int i = 2;
    while (tenants.existsBySlug(candidate)) {
      candidate = base + "-" + i++;
    }
    return candidate;
  }

  private static String text(JsonNode n, String field) {
    JsonNode v = n.path(field);
    if (v.isMissingNode() || v.isNull()) return null;
    String s = v.asText();
    return s == null || s.isBlank() ? null : s;
  }

  private static String enc(String v) {
    return URLEncoder.encode(v, StandardCharsets.UTF_8);
  }
}
