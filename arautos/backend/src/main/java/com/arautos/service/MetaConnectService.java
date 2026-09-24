package com.arautos.service;

import com.arautos.config.ArautosProperties;
import com.arautos.domain.Tenant;
import com.arautos.domain.UserAccount;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.UserAccountRepository;
import com.arautos.security.TokenCryptoService;
import com.arautos.security.UserPrincipal;
import com.arautos.service.meta.MetaGraphClient;
import com.arautos.web.dto.SocialDtos;
import com.arautos.web.error.ApiException;
import io.jsonwebtoken.Claims;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class MetaConnectService {
  private static final String SCOPE_CONNECT =
      "pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish";

  private final ArautosProperties properties;
  private final MetaGraphClient graph;
  private final TenantRepository tenants;
  private final UserAccountRepository users;
  private final TokenCryptoService crypto;
  private final FacebookLoginService oauthState;
  private final SubscriptionService subscriptions;

  public MetaConnectService(ArautosProperties properties, MetaGraphClient graph, TenantRepository tenants,
                            UserAccountRepository users, TokenCryptoService crypto,
                            FacebookLoginService oauthState, SubscriptionService subscriptions) {
    this.properties = properties;
    this.graph = graph;
    this.tenants = tenants;
    this.users = users;
    this.crypto = crypto;
    this.oauthState = oauthState;
    this.subscriptions = subscriptions;
  }

  @Transactional(readOnly = true)
  public SocialDtos.MetaStatusDto status(UserPrincipal principal) {
    Tenant t = requireTenant(principal);
    boolean configured = properties.getFacebookOAuth().isConfigured();
    boolean fb = t.getMetaPageId() != null && t.getMetaPageTokenEnc() != null;
    boolean ig = t.getMetaInstagramId() != null;
    boolean pending = hasValidPending(t);
    String message;
    if (!configured) {
      message = "Meta no configurado. Cargue App ID y App Secret en el .env (nunca en el chat).";
    } else if (fb) {
      message = ig
          ? "Facebook e Instagram conectados para esta concesionaria."
          : "Facebook conectado. Esta Página no tiene Instagram profesional vinculado.";
    } else if (pending) {
      message = "Elija la Página de Facebook de su concesionaria.";
    } else {
      message = "Conecte Meta para publicar en la Página e Instagram de su local (no un token global).";
    }
    return new SocialDtos.MetaStatusDto(
        configured,
        fb,
        ig,
        t.getMetaPageId(),
        t.getMetaPageName(),
        t.getMetaInstagramUsername(),
        t.getMetaConnectedAt(),
        pending,
        message);
  }

  public String startUrl(UserPrincipal principal) {
    requireConfigured();
    Tenant t = requireTenant(principal);
    if (!subscriptions.canWritePanel(t)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Panel en solo lectura");
    }
    ArautosProperties.FacebookOAuth fb = properties.getFacebookOAuth();
    String state = oauthState.signState("connect", principal.getUserId());
    return "https://www.facebook.com/" + fb.getGraphVersion() + "/dialog/oauth"
        + "?client_id=" + enc(fb.getClientId())
        + "&redirect_uri=" + enc(fb.getConnectRedirectUri())
        + "&state=" + enc(state)
        + "&scope=" + enc(SCOPE_CONNECT)
        + "&response_type=code";
  }

  @Transactional
  public String handleCallback(String code, String state, String error) {
    ArautosProperties.FacebookOAuth fb = properties.getFacebookOAuth();
    if (error != null && !error.isBlank()) {
      return connectFail("meta_denied");
    }
    if (!fb.isConfigured()) {
      return connectFail("not_configured");
    }
    try {
      Claims claims = oauthState.parseState(state);
      if (!"connect".equals(claims.get("purpose", String.class))) {
        return connectFail("invalid_state");
      }
      UUID userId = UUID.fromString(claims.getSubject());
      UserAccount user = users.findById(userId)
          .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
      if (user.getTenant() == null) {
        return connectFail("no_tenant");
      }
      Tenant tenant = user.getTenant();
      String shortToken = graph.exchangeCode(code, fb.getConnectRedirectUri());
      String userToken = graph.exchangeLongLivedUserToken(shortToken);
      tenant.setMetaPendingUserTokenEnc(crypto.encrypt(userToken));
      tenant.setMetaPendingExpiresAt(Instant.now().plus(15, ChronoUnit.MINUTES));
      tenants.save(tenant);
      return UriComponentsBuilder.fromUriString(fb.getFrontendConnectSelectUrl())
          .build(true)
          .toUriString();
    } catch (ApiException e) {
      return connectFail("oauth_error");
    } catch (Exception e) {
      return connectFail("oauth_error");
    }
  }

  @Transactional(readOnly = true)
  public SocialDtos.MetaPagesResponse listPendingPages(UserPrincipal principal) {
    Tenant t = requireTenant(principal);
    if (!hasValidPending(t)) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "No hay autorización Meta pendiente. Pulse Conectar Meta.");
    }
    String userToken = crypto.decrypt(t.getMetaPendingUserTokenEnc());
    List<SocialDtos.MetaPageOption> pages = graph.listPages(userToken).stream()
        .map(p -> new SocialDtos.MetaPageOption(
            p.id(),
            p.name(),
            p.instagramId() != null,
            p.instagramUsername()))
        .toList();
    return new SocialDtos.MetaPagesResponse(
        pages,
        pages.isEmpty()
            ? "No se encontraron Páginas administradas. Verifique roles en Meta Business Suite."
            : "Elija la Página que corresponde a su concesionaria.");
  }

  @Transactional
  public SocialDtos.MetaStatusDto selectPage(UserPrincipal principal, SocialDtos.SelectPageRequest req) {
    requireConfigured();
    Tenant t = requireTenant(principal);
    if (!subscriptions.canWritePanel(t)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Panel en solo lectura");
    }
    if (req == null || req.pageId() == null || req.pageId().isBlank()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Indique pageId");
    }
    if (!hasValidPending(t)) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "No hay autorización Meta pendiente");
    }
    String userToken = crypto.decrypt(t.getMetaPendingUserTokenEnc());
    MetaGraphClient.MetaPage page = graph.listPages(userToken).stream()
        .filter(p -> req.pageId().equals(p.id()))
        .findFirst()
        .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Página no autorizada para este usuario"));
    if (page.accessToken() == null || page.accessToken().isBlank()) {
      throw new ApiException(HttpStatus.BAD_GATEWAY, "Meta no devolvió token de Página");
    }
    t.setMetaPageId(page.id());
    t.setMetaPageName(page.name());
    t.setMetaPageTokenEnc(crypto.encrypt(page.accessToken()));
    t.setMetaInstagramId(page.instagramId());
    t.setMetaInstagramUsername(page.instagramUsername());
    t.setMetaConnectedAt(Instant.now());
    t.setMetaPendingUserTokenEnc(null);
    t.setMetaPendingExpiresAt(null);
    tenants.save(t);
    return status(principal);
  }

  @Transactional
  public SocialDtos.MetaStatusDto disconnect(UserPrincipal principal) {
    Tenant t = requireTenant(principal);
    if (!subscriptions.canWritePanel(t)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Panel en solo lectura");
    }
    t.setMetaPageId(null);
    t.setMetaPageName(null);
    t.setMetaPageTokenEnc(null);
    t.setMetaInstagramId(null);
    t.setMetaInstagramUsername(null);
    t.setMetaConnectedAt(null);
    t.setMetaPendingUserTokenEnc(null);
    t.setMetaPendingExpiresAt(null);
    tenants.save(t);
    return status(principal);
  }

  private boolean hasValidPending(Tenant t) {
    return t.getMetaPendingUserTokenEnc() != null
        && t.getMetaPendingExpiresAt() != null
        && t.getMetaPendingExpiresAt().isAfter(Instant.now());
  }

  private String connectFail(String code) {
    return UriComponentsBuilder.fromUriString(properties.getFacebookOAuth().getFrontendConnectSuccessUrl())
        .replaceQueryParam("meta", "error")
        .queryParam("oauth_error", code)
        .build(true)
        .toUriString();
  }

  private Tenant requireTenant(UserPrincipal principal) {
    if (principal.getTenantId() == null) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Sin concesionaria asociada");
    }
    return tenants.findById(principal.getTenantId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
  }

  private void requireConfigured() {
    if (!properties.getFacebookOAuth().isConfigured()) {
      throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
          "Meta no configurado. Defina ARAUTOS_OAUTH_FACEBOOK_* en el .env.");
    }
  }

  private static String enc(String v) {
    return URLEncoder.encode(v, StandardCharsets.UTF_8);
  }
}
