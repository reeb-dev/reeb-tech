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
import com.arautos.web.dto.SocialDtos;
import com.arautos.web.error.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GoogleLoginService {
  private static final String SCOPE = "openid email profile";
  private static final long STATE_TTL_MS = 10 * 60 * 1000L;

  private final ArautosProperties properties;
  private final UserAccountRepository users;
  private final TenantRepository tenants;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final ObjectMapper mapper;
  private final RestClient rest = RestClient.create();
  private final SecretKey stateKey;

  public GoogleLoginService(ArautosProperties properties, UserAccountRepository users,
                            TenantRepository tenants, PasswordEncoder passwordEncoder,
                            JwtService jwtService, ObjectMapper mapper) {
    this.properties = properties;
    this.users = users;
    this.tenants = tenants;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.mapper = mapper;
    byte[] bytes = properties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
    this.stateKey = Keys.hmacShaKeyFor(bytes);
  }

  public SocialDtos.ProviderStatus providerStatus() {
    ArautosProperties.GoogleOAuth g = properties.getGoogleOAuth();
    boolean configured = g.isConfigured();
    String note = configured
        ? "Google Login listo. Redirect URI: " + g.getRedirectUri()
        : "Configure ARAUTOS_OAUTH_GOOGLE_* . En Google Cloud agregue exactamente: "
            + g.getRedirectUri();
    return new SocialDtos.ProviderStatus("google", g.isEnabled(), configured, note);
  }

  public String startUrl() {
    requireConfigured();
    ArautosProperties.GoogleOAuth g = properties.getGoogleOAuth();
    String state = signState();
    return "https://accounts.google.com/o/oauth2/v2/auth"
        + "?client_id=" + enc(g.getClientId())
        + "&redirect_uri=" + enc(g.getRedirectUri())
        + "&response_type=code"
        + "&scope=" + enc(SCOPE)
        + "&state=" + enc(state)
        + "&access_type=online"
        + "&prompt=select_account";
  }

  @Transactional
  public String handleCallback(String code, String state, String error) {
    ArautosProperties.GoogleOAuth g = properties.getGoogleOAuth();
    if (error != null && !error.isBlank()) {
      return failRedirect("google_denied");
    }
    if (!g.isConfigured()) {
      return failRedirect("not_configured");
    }
    try {
      parseState(state);
      if (code == null || code.isBlank()) {
        return failRedirect("missing_code");
      }
      String accessToken = exchangeCode(code, g);
      JsonNode profile = userInfo(accessToken);
      String googleId = text(profile, "sub");
      String email = text(profile, "email");
      String name = text(profile, "name");
      if (googleId == null) {
        return failRedirect("no_profile");
      }
      AuthDtos.AuthResponse auth = loginOrCreate(googleId, email, name);
      UriComponentsBuilder b = UriComponentsBuilder.fromUriString(g.getFrontendSuccessUrl())
          .queryParam("token", auth.token())
          .queryParam("provider", "google")
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

  private String exchangeCode(String code, ArautosProperties.GoogleOAuth g) {
    try {
      String body = "code=" + enc(code)
          + "&client_id=" + enc(g.getClientId())
          + "&client_secret=" + enc(g.getClientSecret())
          + "&redirect_uri=" + enc(g.getRedirectUri())
          + "&grant_type=authorization_code";
      String raw = rest.post()
          .uri(URI.create("https://oauth2.googleapis.com/token"))
          .contentType(MediaType.APPLICATION_FORM_URLENCODED)
          .body(body)
          .retrieve()
          .body(String.class);
      JsonNode json = mapper.readTree(raw == null ? "{}" : raw);
      String token = text(json, "access_token");
      if (token == null) {
        throw new ApiException(HttpStatus.BAD_GATEWAY, "Google no devolvió access_token");
      }
      return token;
    } catch (RestClientResponseException e) {
      throw new ApiException(HttpStatus.BAD_GATEWAY, "Google token: " + e.getStatusCode().value());
    } catch (ApiException e) {
      throw e;
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_GATEWAY, "Error al canjear código Google");
    }
  }

  private JsonNode userInfo(String accessToken) {
    try {
      String raw = rest.get()
          .uri(URI.create("https://www.googleapis.com/oauth2/v3/userinfo"))
          .header("Authorization", "Bearer " + accessToken)
          .retrieve()
          .body(String.class);
      return mapper.readTree(raw == null ? "{}" : raw);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_GATEWAY, "No se pudo leer el perfil de Google");
    }
  }

  private AuthDtos.AuthResponse loginOrCreate(String googleId, String email, String name) {
    Optional<UserAccount> byGoogle = users.findByGoogleUserId(googleId);
    if (byGoogle.isPresent()) {
      return toAuth(byGoogle.get(), null);
    }
    if (email != null && !email.isBlank()) {
      Optional<UserAccount> byEmail = users.findByEmailIgnoreCase(email);
      if (byEmail.isPresent()) {
        UserAccount u = byEmail.get();
        u.setGoogleUserId(googleId);
        users.save(u);
        return toAuth(u, null);
      }
    }
    String safeEmail = email != null && !email.isBlank()
        ? email.trim().toLowerCase(Locale.ROOT)
        : ("google-" + googleId + "@oauth.arautos.local");
    if (users.existsByEmailIgnoreCase(safeEmail)) {
      throw new ApiException(HttpStatus.CONFLICT, "Email ya registrado");
    }
    String dealerName = (name != null && !name.isBlank()) ? name : "Concesionaria Google";
    Tenant tenant = new Tenant();
    tenant.setName(dealerName);
    tenant.setSlug(uniqueSlug(dealerName));
    tenant.setProvince("A completar");
    tenant.setCity("A completar");
    tenant.setWhatsapp("5490000000000");
    tenant.setEmail(safeEmail.contains("@oauth.arautos.local") ? null : safeEmail);
    tenant.setDescription("Alta vía Google Login. Complete provincia, ciudad y WhatsApp.");
    tenant.setModerationStatus(ModerationStatus.PENDIENTE);
    tenant.setSubscriptionStatus(SubscriptionStatus.PENDIENTE_PAGO);
    tenant.setPlanId(properties.getPlan().getId());
    tenants.save(tenant);

    UserAccount user = new UserAccount();
    user.setTenant(tenant);
    user.setEmail(safeEmail);
    user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
    user.setGoogleUserId(googleId);
    user.setRole(UserRole.TENANT_ADMIN);
    users.save(user);
    return toAuth(user, "Cuenta creada con Google. Complete el perfil; un administrador debe aprobar el alta.");
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
    return UriComponentsBuilder.fromUriString(properties.getGoogleOAuth().getFrontendSuccessUrl())
        .queryParam("oauth_error", code)
        .build(true)
        .toUriString();
  }

  private void requireConfigured() {
    if (!properties.getGoogleOAuth().isConfigured()) {
      throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
          "Google OAuth no configurado. Defina ARAUTOS_OAUTH_GOOGLE_* en el .env.");
    }
  }

  private String signState() {
    long now = System.currentTimeMillis();
    return Jwts.builder()
        .claim("purpose", "google_login")
        .issuedAt(new Date(now))
        .expiration(new Date(now + STATE_TTL_MS))
        .signWith(stateKey)
        .compact();
  }

  private void parseState(String state) {
    if (state == null || state.isBlank()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "state inválido");
    }
    Claims claims = Jwts.parser().verifyWith(stateKey).build().parseSignedClaims(state).getPayload();
    if (!"google_login".equals(claims.get("purpose", String.class))) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "state inválido");
    }
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
