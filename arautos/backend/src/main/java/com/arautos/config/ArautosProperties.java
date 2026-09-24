package com.arautos.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "arautos")
public class ArautosProperties {
  private final Jwt jwt = new Jwt();
  private int trialDays = 14;
  private final Plan plan = new Plan();
  private final MercadoPago mercadoPago = new MercadoPago();
  private final FacebookOAuth facebookOAuth = new FacebookOAuth();
  private final GoogleOAuth googleOAuth = new GoogleOAuth();
  private String corsOrigins = "http://localhost:4200";
  private boolean seed = true;
  private String publicBaseUrl = "http://localhost:4200";

  public Jwt getJwt() { return jwt; }
  public int getTrialDays() { return trialDays; }
  public void setTrialDays(int trialDays) { this.trialDays = trialDays; }
  public Plan getPlan() { return plan; }
  public MercadoPago getMercadoPago() { return mercadoPago; }
  public FacebookOAuth getFacebookOAuth() { return facebookOAuth; }
  public GoogleOAuth getGoogleOAuth() { return googleOAuth; }
  public String getCorsOrigins() { return corsOrigins; }
  public void setCorsOrigins(String corsOrigins) { this.corsOrigins = corsOrigins; }
  public boolean isSeed() { return seed; }
  public void setSeed(boolean seed) { this.seed = seed; }
  public String getPublicBaseUrl() { return publicBaseUrl; }
  public void setPublicBaseUrl(String publicBaseUrl) { this.publicBaseUrl = publicBaseUrl; }

  public static class Jwt {
    private String secret;
    private long expirationMs = 86400000;
    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
    public long getExpirationMs() { return expirationMs; }
    public void setExpirationMs(long expirationMs) { this.expirationMs = expirationMs; }
  }

  public static class Plan {
    private String id = "starter";
    private String name = "Starter";
    private String priceUsd = "";
    private String priceArs = "";
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPriceUsd() { return priceUsd; }
    public void setPriceUsd(String priceUsd) { this.priceUsd = priceUsd; }
    public String getPriceArs() { return priceArs; }
    public void setPriceArs(String priceArs) { this.priceArs = priceArs; }
  }

  /**
   * Credenciales y URLs de Mercado Pago vía env. Sin token no se crea preferencia real.
   * Montos del plan siguen en {@link Plan} (vacíos hasta que Manuel los fije).
   */
  public static class MercadoPago {
    private boolean enabled = false;
    private String accessToken = "";
    private String publicKey = "";
    private String webhookSecret = "";
    private String successUrl = "http://localhost:4200/panel?mp=success";
    private String pendingUrl = "http://localhost:4200/panel?mp=pending";
    private String failureUrl = "http://localhost:4200/panel?mp=failure";
    private String notificationUrl = "http://localhost:8080/api/public/mp/webhook";

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getPublicKey() { return publicKey; }
    public void setPublicKey(String publicKey) { this.publicKey = publicKey; }
    public String getWebhookSecret() { return webhookSecret; }
    public void setWebhookSecret(String webhookSecret) { this.webhookSecret = webhookSecret; }
    public String getSuccessUrl() { return successUrl; }
    public void setSuccessUrl(String successUrl) { this.successUrl = successUrl; }
    public String getPendingUrl() { return pendingUrl; }
    public void setPendingUrl(String pendingUrl) { this.pendingUrl = pendingUrl; }
    public String getFailureUrl() { return failureUrl; }
    public void setFailureUrl(String failureUrl) { this.failureUrl = failureUrl; }
    public String getNotificationUrl() { return notificationUrl; }
    public void setNotificationUrl(String notificationUrl) { this.notificationUrl = notificationUrl; }

    public boolean isConfigured() {
      return enabled
          && accessToken != null && !accessToken.isBlank()
          && publicKey != null && !publicKey.isBlank();
    }
  }

  /**
   * Facebook Login (cuenta AR Autos) y Meta Connect (páginas/IG por tenant).
   * Dos redirect URI distintos; sin client secret no se habilita.
   */
  public static class FacebookOAuth {
    private boolean enabled = false;
    private String clientId = "";
    private String clientSecret = "";
    private String loginRedirectUri = "http://localhost:8080/api/auth/oauth/facebook/callback";
    private String connectRedirectUri = "http://localhost:8080/api/panel/social/meta/callback";
    private String frontendLoginSuccessUrl = "http://localhost:4200/panel/oauth/callback";
    private String frontendConnectSuccessUrl = "http://localhost:4200/panel?meta=connected";
    private String frontendConnectSelectUrl = "http://localhost:4200/panel?meta=select";
    private String graphVersion = "v21.0";

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }
    public String getLoginRedirectUri() { return loginRedirectUri; }
    public void setLoginRedirectUri(String loginRedirectUri) { this.loginRedirectUri = loginRedirectUri; }
    public String getConnectRedirectUri() { return connectRedirectUri; }
    public void setConnectRedirectUri(String connectRedirectUri) { this.connectRedirectUri = connectRedirectUri; }
    public String getFrontendLoginSuccessUrl() { return frontendLoginSuccessUrl; }
    public void setFrontendLoginSuccessUrl(String frontendLoginSuccessUrl) { this.frontendLoginSuccessUrl = frontendLoginSuccessUrl; }
    public String getFrontendConnectSuccessUrl() { return frontendConnectSuccessUrl; }
    public void setFrontendConnectSuccessUrl(String frontendConnectSuccessUrl) { this.frontendConnectSuccessUrl = frontendConnectSuccessUrl; }
    public String getFrontendConnectSelectUrl() { return frontendConnectSelectUrl; }
    public void setFrontendConnectSelectUrl(String frontendConnectSelectUrl) { this.frontendConnectSelectUrl = frontendConnectSelectUrl; }
    public String getGraphVersion() { return graphVersion; }
    public void setGraphVersion(String graphVersion) { this.graphVersion = graphVersion; }

    public boolean isConfigured() {
      return enabled
          && clientId != null && !clientId.isBlank()
          && clientSecret != null && !clientSecret.isBlank();
    }
  }

  /**
   * Google Login (cuenta AR Autos). Redirect debe coincidir byte a byte
   * con «Authorized redirect URIs» en Google Cloud Console.
   */
  public static class GoogleOAuth {
    private boolean enabled = false;
    private String clientId = "";
    private String clientSecret = "";
    private String redirectUri = "http://localhost:8080/api/auth/oauth/google/callback";
    private String frontendSuccessUrl = "http://localhost:4200/panel/oauth/callback";

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }
    public String getRedirectUri() { return redirectUri; }
    public void setRedirectUri(String redirectUri) { this.redirectUri = redirectUri; }
    public String getFrontendSuccessUrl() { return frontendSuccessUrl; }
    public void setFrontendSuccessUrl(String frontendSuccessUrl) { this.frontendSuccessUrl = frontendSuccessUrl; }

    public boolean isConfigured() {
      return enabled
          && clientId != null && !clientId.isBlank()
          && clientSecret != null && !clientSecret.isBlank();
    }
  }
}
